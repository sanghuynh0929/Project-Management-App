import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workItemService } from '@/services/workItemService';
import { sprintService } from '@/services/sprintService';
import type { WorkItem, Sprint } from '@/lib/types';

interface EditWorkItemDialogProps {
  workItem: WorkItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditWorkItemDialog: React.FC<EditWorkItemDialogProps> = ({
  workItem,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WorkItem['type']>('STORY');
  const [priority, setPriority] = useState<WorkItem['priority']>('MEDIUM');
  const [status, setStatus] = useState<WorkItem['status']>('TODO');
  const [sprintId, setSprintId] = useState<WorkItem['sprintId']>(null);
  const [location, setLocation] = useState<WorkItem['location']>('BACKLOG');
  const [availableSprints, setAvailableSprints] = useState<Sprint[]>([]);
  const [initialStatus, setInitialStatus] = useState<WorkItem['status']>('TODO');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all sprints for the project
        const { data: sprintsData } = await sprintService.getByProjectId(workItem.projectId);
        // Filter to include active and not started sprints
        const availableSprintsData = sprintsData.filter((sprint: Sprint) => 
          sprint.status === 'ACTIVE' || sprint.status === 'NOT_STARTED'
        );
        setAvailableSprints(availableSprintsData);
      } catch (err) {
        console.error('Error fetching sprints:', err);
        setError('Failed to load sprints. Please try again.');
      }
    };

    if (open) {
      fetchData();
      // Initialize form with work item data
      setTitle(workItem.title);
      setDescription(workItem.description || '');
      setType(workItem.type);
      setPriority(workItem.priority);
      setStatus(workItem.status);
      setInitialStatus(workItem.status);
      setLocation(workItem.location);
      setSprintId(workItem.sprintId);
    }
  }, [open, workItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedWorkItem: Partial<WorkItem> = {
        title,
        description: description || null,
        type,
        priority,
        status,
        location,
        sprintId: location === 'BACKLOG' ? null : sprintId,
        projectId: workItem.projectId,
        epicId: workItem.epicId,
        storyPoints: workItem.storyPoints
      };

      await workItemService.update(workItem.id, updatedWorkItem);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Error updating work item:', err);
      setError('Failed to update work item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLocationDisplayValue = () => {
    if (status === 'DONE') {
      return 'Completed';
    }
    if (sprintId === null) {
      return 'Backlog';
    }
    return availableSprints.find(s => s.id === sprintId)?.name || 'Backlog';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Work Item</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>Update the details for {workItem.title}</p>
              {initialStatus === 'DONE' && (
                <p className="mt-2 text-sm text-yellow-600">
                  Note: Status cannot be changed as this item is already completed
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: WorkItem['type']) => setType(value)}>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STORY">Story</SelectItem>
                  <SelectItem value="BUG">Bug</SelectItem>
                  <SelectItem value="TASK">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: WorkItem['priority']) => setPriority(value)}>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={(newStatus: WorkItem['status']) => {
                  setStatus(newStatus);
                  if (newStatus === 'DONE') {
                    setLocation('COMPLETED');
                  } else {
                    setLocation(sprintId === null ? 'BACKLOG' : 'SPRINT');
                  }
                }}
              >
                <SelectTrigger disabled={loading || initialStatus === 'DONE'}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprintId">Location</Label>
              <Select 
                value={status === 'DONE' ? 'completed' : (sprintId === null ? 'backlog' : availableSprints.find(s => s.id === sprintId)?.name || 'backlog')}
                onValueChange={(value) => {
                  if (value === 'backlog') {
                    setSprintId(null);
                    setLocation('BACKLOG');
                  } else if (value !== 'completed') {
                    const selectedSprint = availableSprints.find(s => s.name === value);
                    if (selectedSprint) {
                      setSprintId(selectedSprint.id);
                      setLocation('SPRINT');
                    }
                  }
                }}
              >
                <SelectTrigger disabled={status === 'DONE' || loading}>
                  <SelectValue>{getLocationDisplayValue()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {status !== 'DONE' && (
                    <>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      {availableSprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.name}>
                          {sprint.name} ({sprint.status === 'ACTIVE' ? 'Active' : 'Not Started'})
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkItemDialog; 