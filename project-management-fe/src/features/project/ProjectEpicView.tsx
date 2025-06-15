import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { epicService } from '@/services/epicService';
import { workItemService } from '@/services/workItemService';
import { personAssignmentService } from '@/services/personAssignmentService';
import { costAssignmentService } from '@/services/costAssignmentService';
import EditEpicDialog from '@/features/project/components/EditEpicDialog';
import EpicCard from '@/features/project/components/EpicCard';

interface EpicViewProps {
  projectId: number;
}

const EpicView: React.FC<EpicViewProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const { projectId: paramProjectId } = useParams();
  const [epics, setEpics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEpic, setEditingEpic] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: epicsData } = await epicService.getByProjectId(projectId);
        const epicStats = await Promise.all(
          epicsData.map(async (epic: any) => {
            const [workItemsRes, epicPersonAssignmentsRes, epicCostAssignmentsRes] = await Promise.all([
              workItemService.getByEpicId(epic.id),
              personAssignmentService.getByEpicId(epic.id),
              costAssignmentService.getByEpicId(epic.id)
            ]);

            const workItems = workItemsRes.data;
            const personAssignments = epicPersonAssignmentsRes.data;
            const costAssignments = epicCostAssignmentsRes.data;

            const assignedPeople = personAssignments.length;
            
            // Get epic-level cost assignments
            const epicCostIds = costAssignments.map((ca: any) => ca.costId);
            
            // Get work item level cost assignments
            const workItemCostAssignments = await Promise.all(
              workItems.map((workItem: any) => costAssignmentService.getByWorkItemId(workItem.id))
            );
            const workItemCostIds = workItemCostAssignments.flatMap((res: any) => 
              res.data.map((ca: any) => ca.costId)
            );

            // Combine all cost IDs and remove duplicates
            const allCostIds = [...new Set([...epicCostIds, ...workItemCostIds])];

            let totalCost = 0;
            if (allCostIds.length > 0) {
              const costResArr = await Promise.all(
                allCostIds.map((costId: number) => 
                  import('@/services/costService.ts').then(m => m.costService.getById(costId))
                )
              );
              totalCost = costResArr.reduce((sum: number, res: any) => sum + (res.data.amount || 0), 0);
            }
            return {
              ...epic,
              workItemCount: workItems.length,
              assignedPeople,
              totalCost,
            };
          })
        );
        setEpics(epicStats);
      } catch (err) {
        setEpics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleEpicClick = (epicId: number) => {
    navigate(`/projects/${paramProjectId}/epics/${epicId}`);
  };

  const handleEdit = (epic: any) => {
    setEditingEpic(epic);
  };

  const handleCreate = () => {
    setEditingEpic({});
  };

  const handleEditSuccess = async (updatedEpic: any) => {
    setEditingEpic(null);
    // Refresh the epics list with all calculated statistics
    const { data: epicsData } = await epicService.getByProjectId(projectId);
    const epicStats = await Promise.all(
      epicsData.map(async (epic: any) => {
        const [workItemsRes, epicPersonAssignmentsRes, epicCostAssignmentsRes] = await Promise.all([
          workItemService.getByEpicId(epic.id),
          personAssignmentService.getByEpicId(epic.id),
          costAssignmentService.getByEpicId(epic.id)
        ]);

        const workItems = workItemsRes.data;
        const personAssignments = epicPersonAssignmentsRes.data;
        const costAssignments = epicCostAssignmentsRes.data;

        const assignedPeople = personAssignments.length;
        
        // Get epic-level cost assignments
        const epicCostIds = costAssignments.map((ca: any) => ca.costId);
        
        // Get work item level cost assignments
        const workItemCostAssignments = await Promise.all(
          workItems.map((workItem: any) => costAssignmentService.getByWorkItemId(workItem.id))
        );
        const workItemCostIds = workItemCostAssignments.flatMap((res: any) => 
          res.data.map((ca: any) => ca.costId)
        );

        // Combine all cost IDs and remove duplicates
        const allCostIds = [...new Set([...epicCostIds, ...workItemCostIds])];

        let totalCost = 0;
        if (allCostIds.length > 0) {
          const costResArr = await Promise.all(
            allCostIds.map((costId: number) => 
              import('@/services/costService.ts').then(m => m.costService.getById(costId))
            )
          );
          totalCost = costResArr.reduce((sum: number, res: any) => sum + (res.data.amount || 0), 0);
        }

        return {
          ...epic,
          workItemCount: workItems.length,
          assignedPeople,
          totalCost,
        };
      })
    );
    setEpics(epicStats);
  };

  const handleDelete = async (epicId: number) => {
    try {
      await epicService.delete(epicId);
      setEpics(prev => prev.filter(epic => epic.id !== epicId));
    } catch (error) {
      console.error('Error deleting epic:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading epics...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Epics</h1>
          <p className="text-gray-600">Manage project epics and track progress</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Epic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {epics.map((epic) => (
          <EpicCard
            key={epic.id}
            epic={epic}
            onClick={handleEpicClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <EditEpicDialog
        projectId={projectId}
        epic={editingEpic}
        open={!!editingEpic}
        onOpenChange={(open) => !open && setEditingEpic(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default EpicView;