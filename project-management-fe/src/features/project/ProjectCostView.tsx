import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { epicService } from '@/services/epicService';
import { workItemService } from '@/services/workItemService';
import { costAssignmentService } from '@/services/costAssignmentService';
import { sprintService } from '@/services/sprintService';

interface CostViewProps {
  projectId: number;
}

const ProjectCostView: React.FC<CostViewProps> = ({ projectId }) => {
  const [costData, setCostData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total: 0, development: 0, design: 0, other: 0 });
  const [loading, setLoading] = useState(true);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Development': return 'bg-blue-100 text-blue-800';
      case 'Design': return 'bg-purple-100 text-purple-800';
      case 'Testing': return 'bg-green-100 text-green-800';
      case 'Integration': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
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
        // Gather all unique sprints in the project
        const allProjectSprints = Array.from(new Set(workItems.map((wi: any) => wi.sprintName || 'Sprint')));
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
        // 2. For each epic and work item, fetch cost assignments
        const epicData = await Promise.all(
          epics.map(async (epic: any) => {
            const epicCostAssignmentsRes = await costAssignmentService.getByEpicId(epic.id);
            const epicCostAssignments = epicCostAssignmentsRes.data;
            // For each cost assignment, fetch the cost object
            const costObjs = await Promise.all(
              epicCostAssignments.map((ca: any) => import('@/services/costService').then(m => m.costService.getById(ca.costId)))
            );
            // Group by sprint (if available on cost assignment or cost)
            // For demo, just group all under the epic
            return {
              epicName: epic.title,
              sprints: [
                ...costObjs.map((res: any, idx: number) => {
                  let sprintName = epic.sprintName || 'Epic';
                  const dates = allSprintDates[sprintName];
                  if (dates && dates.startDate && dates.endDate) {
                    sprintName = `${sprintName} (${new Date(dates.startDate).toDateString()} - ${new Date(dates.endDate).toDateString()})`;
                  }
                  return {
                    sprintName,
                    amount: res.data.amount || 0,
                    category: res.data.category || 'Other',
                  };
                })
              ],
              totalCost: costObjs.reduce((sum: number, res: any) => sum + (res.data.amount || 0), 0),
            };
          })
        );
        // For work items
        const workItemData = await Promise.all(
          workItems.map(async (wi: any) => {
            const wiCostAssignmentsRes = await costAssignmentService.getByWorkItemId(wi.id);
            const wiCostAssignments = wiCostAssignmentsRes.data;
            const costObjs = await Promise.all(
              wiCostAssignments.map((ca: any) => import('@/services/costService').then(m => m.costService.getById(ca.costId)))
            );
            let sprintName = wi.sprintName || 'Sprint';
            const dates = allSprintDates[sprintName];
            if (dates && dates.startDate && dates.endDate) {
              sprintName = `${sprintName} (${new Date(dates.startDate).toDateString()} - ${new Date(dates.endDate).toDateString()})`;
            }
            return {
              epicName: wi.epicTitle || 'Work Item',
              sprints: [
                ...costObjs.map((res: any, idx: number) => ({
                  sprintName,
                  amount: res.data.amount || 0,
                  category: res.data.category || 'Other',
                }))
              ],
              totalCost: costObjs.reduce((sum: number, res: any) => sum + (res.data.amount || 0), 0),
            };
          })
        );
        const allData = [...epicData, ...workItemData];
        setCostData(allData);
        // Summary
        const total = allData.reduce((sum, e) => sum + e.totalCost, 0);
        const development = allData.reduce((sum, e) => sum + e.sprints.filter((s: any) => s.category === 'Development').reduce((s2: number, s: any) => s2 + s.amount, 0), 0);
        const design = allData.reduce((sum, e) => sum + e.sprints.filter((s: any) => s.category === 'Design').reduce((s2: number, s: any) => s2 + s.amount, 0), 0);
        const other = total - development - design;
        setSummary({ total, development, design, other });
      } catch (err) {
        setCostData([]);
        setSummary({ total: 0, development: 0, design: 0, other: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading costs...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cost Analysis</h1>
        <p className="text-gray-600">Track costs and budget allocation across epics and sprints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Costs by Epic and Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Epic</TableHead>
                <TableHead>Sprint</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total Epic Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costData.map((epic, epicIndex) => (
                epic.sprints.map((sprint: any, sprintIndex: number) => (
                  <TableRow key={`${epicIndex}-${sprintIndex}`}>
                    {sprintIndex === 0 && (
                      <TableCell rowSpan={epic.sprints.length} className="font-medium border-r">
                        {epic.epicName}
                      </TableCell>
                    )}
                    <TableCell>{sprint.sprintName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        ${sprint.amount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(sprint.category)}>
                        {sprint.category}
                      </Badge>
                    </TableCell>
                    {sprintIndex === 0 && (
                      <TableCell rowSpan={epic.sprints.length} className="text-right font-semibold border-l">
                        <Badge className="bg-blue-100 text-blue-800">
                          ${epic.totalCost.toLocaleString()}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Project Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${summary.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Development Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${summary.development.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Design Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${summary.design.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Other Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${summary.other.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectCostView;