import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkItemCardProps {
  workItem: {
    id: number;
    title: string;
    description: string | '';
    type: string;
    priority: string;
    status: string;
    sprintId: number | null;
    projectId: number;
  };
  onEdit: (workItem: WorkItemCardProps['workItem']) => void;
  onDelete: (workItemId: number) => void;
}

const WorkItemCard: React.FC<WorkItemCardProps> = ({ workItem, onEdit, onDelete }) => {
  return (
    <Card className="p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium flex-1 pr-2">{workItem.title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(workItem)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(workItem.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between text-sm">
        <Badge variant="outline" className={
          workItem.type === 'STORY' ? 'bg-purple-50 text-purple-700 border-purple-200' :
          workItem.type === 'BUG' ? 'bg-red-50 text-red-700 border-red-200' :
          workItem.type === 'TASK' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'text-gray-600'
        }>
          {workItem.type}
        </Badge>
        <Badge variant="outline" className={
          workItem.priority === 'CRITICAL' ? 'bg-red-900 text-white border-red-900' :
          workItem.priority === 'HIGH' ? 'bg-red-500 text-white border-red-500' :
          workItem.priority === 'MEDIUM' ? 'bg-orange-500 text-white border-orange-500' :
          workItem.priority === 'LOW' ? 'bg-yellow-500 text-white border-yellow-500' :
          'text-gray-600'
        }>
          {workItem.priority}
        </Badge>
      </div>
    </Card>
  );
};

export default WorkItemCard; 