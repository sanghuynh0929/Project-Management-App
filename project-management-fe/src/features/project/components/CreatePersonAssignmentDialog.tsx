import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { personService } from '@/services/personService';
import { epicService } from '@/services/epicService';
import { workItemService } from '@/services/workItemService';
import { personAssignmentService } from '@/services/personAssignmentService';
import { sprintService } from '@/services/sprintService';
import type { Person, Epic, WorkItem } from '@/lib/types';

interface CreatePersonAssignmentDialogProps {
  projectId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DEFAULT_BACKLOG_DAYS = 14;
const DEFAULT_FTE_HOURS = 5.7;

const CreatePersonAssignmentDialog: React.FC<CreatePersonAssignmentDialogProps> = ({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [assignmentType, setAssignmentType] = useState<'epic' | 'workitem'>('epic');
  const [selectedEpicId, setSelectedEpicId] = useState<number | null>(null);
  const [selectedWorkItemId, setSelectedWorkItemId] = useState<number | null>(null);
  const [hours, setHours] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // New state for FTE calculation
  const [useFteCalculation, setUseFteCalculation] = useState(true);
  const [fteHoursPerDay, setFteHoursPerDay] = useState(DEFAULT_FTE_HOURS.toString());
  const [numberOfDays, setNumberOfDays] = useState('');

  const calculateDaysFromDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peopleRes, epicsRes, workItemsRes] = await Promise.all([
          personService.getAll(),
          epicService.getByProjectId(projectId),
          workItemService.getByProjectId(projectId),
        ]);
        setPeople(peopleRes.data);
        setEpics(epicsRes.data);
        setWorkItems(workItemsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      }
    };

    if (open) {
      fetchData();
      // Reset form
      setSelectedPersonId(null);
      setAssignmentType('epic');
      setSelectedEpicId(null);
      setSelectedWorkItemId(null);
      setHours('');
      setDescription('');
      setError(null);
      setUseFteCalculation(true);
      setFteHoursPerDay(DEFAULT_FTE_HOURS.toString());
      setNumberOfDays('');
    }
  }, [open, projectId]);

  // Effect to auto-calculate days when epic/workitem selection changes
  useEffect(() => {
    const calculateDays = async () => {
      try {
        if (assignmentType === 'epic' && selectedEpicId) {
          const epic = epics.find(e => e.id === selectedEpicId);
          if (epic && epic.startDate && epic.endDate) {
            const days = calculateDaysFromDates(epic.startDate, epic.endDate);
            setNumberOfDays(days.toString());
          }
        } else if (assignmentType === 'workitem' && selectedWorkItemId) {
          const workItem = workItems.find(w => w.id === selectedWorkItemId);
          if (workItem?.sprintId) {
            const sprintRes = await sprintService.getById(workItem.sprintId);
            const sprint = sprintRes.data;
            if (sprint.startDate && sprint.endDate) {
              const days = calculateDaysFromDates(sprint.startDate, sprint.endDate);
              setNumberOfDays(days.toString());
            }
          } else {
            // Work item is in backlog
            setNumberOfDays(DEFAULT_BACKLOG_DAYS.toString());
          }
        }
      } catch (err) {
        console.error('Error calculating days:', err);
      }
    };

    calculateDays();
  }, [assignmentType, selectedEpicId, selectedWorkItemId, epics, workItems]);

  // Effect to calculate hours when FTE inputs change
  useEffect(() => {
    if (useFteCalculation && fteHoursPerDay && numberOfDays) {
      const calculatedHours = (parseFloat(fteHoursPerDay) * parseFloat(numberOfDays)).toFixed(1);
      setHours(calculatedHours);
    }
  }, [useFteCalculation, fteHoursPerDay, numberOfDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const assignmentData = {
        personId: selectedPersonId,
        epicId: assignmentType === 'epic' ? selectedEpicId : null,
        workItemId: assignmentType === 'workitem' ? selectedWorkItemId : null,
        hours: Number(hours),
        description: description || null,
      };

      await personAssignmentService.create(assignmentData);
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Error creating person assignment:', err);
      setError('Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Person</DialogTitle>
          <DialogDescription>
            Create a new person assignment for an epic or work item
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="person">Person</Label>
            <Select
              value={selectedPersonId?.toString() || ''}
              onValueChange={(value) => setSelectedPersonId(Number(value))}
            >
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                {people.map((person) => (
                  <SelectItem key={person.id} value={person.id.toString()}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignmentType">Assignment Type</Label>
            <Select
              value={assignmentType}
              onValueChange={(value: 'epic' | 'workitem') => {
                setAssignmentType(value);
                setSelectedEpicId(null);
                setSelectedWorkItemId(null);
              }}
            >
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="workitem">Work Item</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {assignmentType === 'epic' ? (
            <div className="space-y-2">
              <Label htmlFor="epic">Epic</Label>
              <Select
                value={selectedEpicId?.toString() || ''}
                onValueChange={(value) => setSelectedEpicId(Number(value))}
              >
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select epic" />
                </SelectTrigger>
                <SelectContent>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id.toString()}>
                      {epic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="workItem">Work Item</Label>
              <Select
                value={selectedWorkItemId?.toString() || ''}
                onValueChange={(value) => setSelectedWorkItemId(Number(value))}
              >
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select work item" />
                </SelectTrigger>
                <SelectContent>
                  {workItems.map((workItem) => (
                    <SelectItem key={workItem.id} value={workItem.id.toString()}>
                      {workItem.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={useFteCalculation}
              onCheckedChange={setUseFteCalculation}
              id="fte-mode"
            />
            <Label htmlFor="fte-mode">Calculate hours using FTE</Label>
          </div>

          {useFteCalculation ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="fteHours">Hours per day (FTE)</Label>
                <Input
                  id="fteHours"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={fteHoursPerDay}
                  onChange={(e) => setFteHoursPerDay(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Number of days</Label>
                <Input
                  id="days"
                  type="number"
                  step="1"
                  min="1"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>Calculated Hours</Label>
                <div className="text-sm text-gray-600">
                  {hours ? `${hours} hours` : 'Please fill in FTE and days'}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                step="0.1"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
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
              {loading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonAssignmentDialog; 