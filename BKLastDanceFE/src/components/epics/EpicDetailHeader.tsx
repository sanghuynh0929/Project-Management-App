// src/components/epics/EpicDetailHeader.tsx
import React from 'react';
import {
  Button,
} from '@/components/ui/button';
import { Badge }          from '@/components/ui/badge';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Edit, Calendar, User, TrendingUp,
} from 'lucide-react';

import { Epic } from '@/types';
import { formatDate } from '@/utils/date';

import { useQuery }           from '@tanstack/react-query';
import { personService }      from '@/services/personService';

interface EpicDetailHeaderProps {
  epic: Epic;
  onEdit?: () => void;
}

export function EpicDetailHeader({ epic, onEdit }: EpicDetailHeaderProps) {
  /* ---------------- assignee: fetch real person ---------------- */
  const { data: assignee, isLoading: lAssignee } = useQuery({
    queryKey : ['person', epic.assigneeId],
    queryFn  : () => personService.getPersonById(epic.assigneeId),
    enabled  : !!epic.assigneeId,
  });

  /* ---------------- badge colour helper ---------------- */
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DONE':
      case 'Done':
        return 'default';
      case 'IMPLEMENTING':
      case 'Implementing':
        return 'secondary';
      case 'READY_FOR_DEV':
      case 'Ready for dev':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
      <Card>
        {/* ---------- header ---------- */}
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold">{epic.title}</CardTitle>
              {epic.code && <Badge variant="outline">{epic.code}</Badge>}
            </div>
            {epic.description && (
                <p className="text-muted-foreground">{epic.description}</p>
            )}
          </div>

          {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Epic
              </Button>
          )}
        </CardHeader>

        {/* ---------- meta grid ---------- */}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={getStatusBadgeVariant(String(epic.status))}>
                  {epic.status}
                </Badge>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assignee</p>
                <p className="text-sm text-muted-foreground">
                  {lAssignee
                      ? 'Loading...'
                      : assignee?.name ?? 'Unassigned'}
                </p>
              </div>
            </div>

            {/* Start date */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(epic.startDate)}
                </p>
              </div>
            </div>

            {/* End date */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Target end date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(epic.targetEndDate ?? epic.targetEndDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
