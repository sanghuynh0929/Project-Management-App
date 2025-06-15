import React, { useEffect, useState } from 'react';
import { epicService } from '@/services/epicService';
import { workItemService } from '@/services/workItemService';
import { personAssignmentService } from '@/services/personAssignmentService';
import { sprintService } from '@/services/sprintService';
import { personService } from '@/services/personService';
import CreatePersonAssignmentDialog from './components/CreatePersonAssignmentDialog';
import ReallocatePersonAssignmentDialog from './components/ReallocatePersonAssignmentDialog';
import ResourceHeader from './components/ResourceHeader';
import ResourceSummary from './components/ResourceSummary';
import EpicSprintTable from './components/EpicSprintTable';
import PersonSprintTable from './components/PersonSprintTable';

interface ResourceViewProps {
  projectId: number;
}

const DEFAULT_BASE_FTE = 5.7;

const ProjectResourceView: React.FC<ResourceViewProps> = ({ projectId }) => {
  const [epicResourceData, setEpicResourceData] = useState<any[]>([]);
  const [personBySprintData, setPersonBySprintData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalHours: 0, teamMembers: 0, avgHoursPerSprint: 0 });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [baseFte, setBaseFte] = useState(DEFAULT_BASE_FTE);
  const [reallocationData, setReallocationData] = useState<{
    epicId: number;
    personId: number;
    personName: string;
    epicAssignment: any;
  } | null>(null);
  const [personNames, setPersonNames] = useState<Record<number, string>>({});

  const fetchPersonNames = async (personIds: number[]) => {
    try {
      const uniqueIds = Array.from(new Set(personIds));
      const personData = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await personService.getById(id);
          return response.data;
        })
      );
      const nameMap = Object.fromEntries(
        personData.map(person => [person.id, person.name])
      );
      setPersonNames(nameMap);
    } catch (err) {
      console.error('Error fetching person names:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all epics and work items for the project
      const [epicsRes, workItemsRes] = await Promise.all([
        epicService.getByProjectId(projectId),
        workItemService.getByProjectId(projectId),
      ]);
      const epics = epicsRes.data;
      const workItems = workItemsRes.data;

      // Get all work item and epic IDs
      const allProjectWorkItemIds = workItems.map((wi: any) => wi.id);
      const allProjectEpicIds = epics.map((epic: any) => epic.id);

      // Get all assignments
      const [workItemAssignmentsRes, epicAssignmentsRes] = await Promise.all([
        Promise.all(allProjectWorkItemIds.map((id: number) => personAssignmentService.getByWorkItemId(id))),
        Promise.all(allProjectEpicIds.map((id: number) => personAssignmentService.getByEpicId(id))),
      ]);

      const allProjectWorkItemAssignments = workItemAssignmentsRes.flatMap(res => res.data);
      const allProjectEpicAssignments = epicAssignmentsRes.flatMap(res => res.data);

      // Collect all unique person IDs
      const allPersonIds = new Set<number>();
      allProjectWorkItemAssignments.forEach((pa: any) => allPersonIds.add(pa.personId));
      allProjectEpicAssignments.forEach((pa: any) => allPersonIds.add(pa.personId));

      // Fetch person names
      await fetchPersonNames(Array.from(allPersonIds));

      // 2. For each epic, fetch person assignments for epic and its work items
      const epicData = await Promise.all(
        epics.map(async (epic: any) => {
          // Work items for this epic
          const epicWorkItems = workItems.filter((wi: any) => wi.epicId === epic.id);
          // Person assignments for epic
          const epicPersonAssignments = allProjectEpicAssignments.filter(pa => pa.epicId === epic.id);
          // Person assignments for each work item
          const workItemPersonAssignmentsArr = epicWorkItems.map(wi => 
            allProjectWorkItemAssignments.filter(pa => pa.workItemId === wi.id)
          );

          // Map sprints
          const sprints = Array.from(new Set(epicWorkItems.map((wi: any) => wi.sprintName || 'Sprint')));
          // Fetch sprint start/end dates for each unique sprint name (if possible)
          const sprintIdMap: Record<string, number> = {};
          epicWorkItems.forEach((wi: any) => {
            if (wi.sprintName && wi.sprintId) sprintIdMap[wi.sprintName] = wi.sprintId;
          });
          const sprintDates: Record<string, { startDate?: string; endDate?: string }> = {};
          await Promise.all(Object.entries(sprintIdMap).map(async ([sprintName, sprintId]) => {
            try {
              const sprintRes = await sprintService.getById(sprintId);
              sprintDates[sprintName] = {
                startDate: sprintRes.data.startDate,
                endDate: sprintRes.data.endDate,
              };
            } catch {}
          }));

          // Table 1: Hours by Epic and Person (by sprint)
          // For each sprint, sum all person assignments for work items in that sprint
          const sprintRows = sprints.map((sprintName: string) => {
            const sprintWorkItems = epicWorkItems.filter((wi: any) => (wi.sprintName || 'Sprint') === sprintName);
            const assignments = sprintWorkItems.flatMap((wi: any, idx: number) => workItemPersonAssignmentsArr[epicWorkItems.indexOf(wi)]);
            const totalHours = assignments.reduce((sum: number, pa: any) => sum + (pa.hours || 0), 0);
            const fte = baseFte > 0 ? totalHours / baseFte : 0;
            const dates = sprintDates[sprintName];
            let sprintLabel = sprintName;
            if (dates && dates.startDate && dates.endDate) {
              sprintLabel = `${sprintName} (${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.endDate).toLocaleDateString()})`;
            }
            return {
              sprintName: sprintLabel,
              totalHours: Number(totalHours.toFixed(1)),
              fte: Number(fte.toFixed(1)),
              assignments,
            };
          });

          const workItemPersonIds = new Set(workItemPersonAssignmentsArr.flatMap(assignments => assignments.map((pa: any) => pa.personId)));
          const epicOnlyAssignments = epicPersonAssignments.filter((pa: any) => !workItemPersonIds.has(pa.personId));
          const epicOnlyHours = epicOnlyAssignments.reduce((sum: number, pa: any) => sum + (pa.hours || 0), 0);
          const epicOnlyFte = baseFte > 0 ? epicOnlyHours / baseFte : 0;
          const totalEpicHours = sprintRows.reduce((sum, s) => sum + s.totalHours, 0) + Number(epicOnlyHours.toFixed(1));
          const totalEpicFte = baseFte > 0 ? totalEpicHours / baseFte : 0;

          return {
            epicName: epic.title,
            id: epic.id,
            sprints: sprintRows,
            epicOnly: {
              totalHours: Number(epicOnlyHours.toFixed(1)),
              fte: Number(epicOnlyFte.toFixed(1)),
              assignments: epicOnlyAssignments,
            },
            totalEpicHours: Number(totalEpicHours.toFixed(1)),
            totalEpicFte: Number(totalEpicFte.toFixed(1)),
          };
        })
      );

      setEpicResourceData(epicData);

      // Table 2: Person by Sprint
      const allProjectSprints = Array.from(new Set(workItems.map((wi: any) => wi.sprintName || 'Sprint')));
      // Map sprint name to timeline (fetch dates)
      const allSprintIdMap: Record<string, number> = {};
      workItems.forEach((wi: any) => {
        if (wi.sprintName && wi.sprintId) allSprintIdMap[wi.sprintName] = wi.sprintId;
      });
      const allSprintDates: Record<string, { startDate?: string; endDate?: string }> = {};
      await Promise.all(Object.entries(allSprintIdMap).map(async ([sprintName, sprintId]) => {
        try {
          const sprintRes = await sprintService.getById(sprintId);
          allSprintDates[sprintName] = {
            startDate: sprintRes.data.startDate,
            endDate: sprintRes.data.endDate,
          };
        } catch {}
      }));

      // For each person, sum across all epics
      const personRows = await Promise.all(Array.from(allPersonIds).map(async (personId: number) => {
        // For each sprint in the project
        const sprintHours = allProjectSprints.map((sprintName: string) => {
          // All assignments for this person in this sprint (across all work items in this project)
          const assignments = workItems
            .filter((wi: any) => (wi.sprintName || 'Sprint') === sprintName)
            .flatMap((wi: any) => allProjectWorkItemAssignments.filter((pa: any) => pa.workItemId === wi.id && pa.personId === personId));
          const totalHours = assignments.reduce((sum: number, pa: any) => sum + (pa.hours || 0), 0);
          const fte = baseFte > 0 ? totalHours / baseFte : 0;
          const dates = allSprintDates[sprintName];
          let sprintLabel = sprintName;
          if (dates && dates.startDate && dates.endDate) {
            sprintLabel = `${sprintName} (${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.endDate).toLocaleDateString()})`;
          }
          return {
            sprintName: sprintLabel,
            totalHours: Number(totalHours.toFixed(1)),
            fte: Number(fte.toFixed(1)),
          };
        });

        // Epic-specific allocation for this person
        const epicOnlyAssignments = allProjectEpicAssignments.filter((pa: any) => pa.personId === personId);
        const epicOnlyHours = epicOnlyAssignments.reduce((sum: number, pa: any) => sum + (pa.hours || 0), 0);
        const total = sprintHours.reduce((sum: number, s: any) => sum + s.totalHours, 0) + Number(epicOnlyHours.toFixed(1));

        return {
          personId,
          personName: getPersonName(personId),
          sprintHours,
          epicOnlyHours: Number(epicOnlyHours.toFixed(1)),
          total: Number(total.toFixed(1)),
        };
      }));

      // Sort person rows by name
      personRows.sort((a, b) => a.personName.localeCompare(b.personName));

      setPersonBySprintData([{
        sprints: allProjectSprints.map((sprintName: string) => {
          const dates = allSprintDates[sprintName];
          let sprintLabel = sprintName;
          if (dates && dates.startDate && dates.endDate) {
            sprintLabel = `${sprintName} (${new Date(dates.startDate).toDateString()} - ${new Date(dates.endDate).toDateString()})`;
          }
          return sprintLabel;
        }),
        personRows
      }]);

      // Summary calculations
      const totalHours = epicData.reduce((sum, e) => sum + e.totalEpicHours, 0);
      const allPeople = new Set(epicData.flatMap(e => e.sprints.flatMap((s: any) => s.people)));
      const allSprints = epicData.reduce((sum, e) => sum + e.sprints.length, 0);
      setSummary({
        totalHours,
        teamMembers: allPeople.size,
        avgHoursPerSprint: allSprints ? Math.round(totalHours / allSprints) : 0,
      });
    } catch (err) {
      setEpicResourceData([]);
      setPersonBySprintData([]);
      setSummary({ totalHours: 0, teamMembers: 0, avgHoursPerSprint: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getPersonName = (personId: number) => {
    return personNames[personId] || `Person ${personId}`;
  };

  const formatHours = (hours: number) => {
    return Number(hours.toFixed(1));
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading resources...</div>;
  }

  return (
    <div className="p-6">
      <ResourceHeader
        baseFte={baseFte}
        onBaseFteChange={(value) => {
          setBaseFte(value);
          fetchData();
        }}
        onAssignPerson={() => setShowCreateDialog(true)}
      />

      <CreatePersonAssignmentDialog
        projectId={projectId}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchData();
        }}
      />

      <ReallocatePersonAssignmentDialog
        epicId={reallocationData?.epicId || 0}
        personId={reallocationData?.personId || 0}
        personName={reallocationData?.personName || ''}
        epicAssignment={reallocationData?.epicAssignment || null}
        open={!!reallocationData && !!reallocationData.epicAssignment}
        onOpenChange={(open) => !open && setReallocationData(null)}
        onSuccess={() => {
          setReallocationData(null);
          fetchData();
        }}
      />

      <EpicSprintTable
        epicResourceData={epicResourceData}
        formatHours={formatHours}
        getPersonName={getPersonName}
        onReallocate={setReallocationData}
      />

      <PersonSprintTable
        personBySprintData={personBySprintData}
        formatHours={formatHours}
      />

      <ResourceSummary
        totalHours={summary.totalHours}
        teamMembers={summary.teamMembers}
        avgHoursPerSprint={summary.avgHoursPerSprint}
        formatHours={formatHours}
      />
    </div>
  );
};

export default ProjectResourceView;