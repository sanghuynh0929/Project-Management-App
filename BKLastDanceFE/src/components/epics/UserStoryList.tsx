
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UserStory } from '@/types';
import { getTeamMemberById, formatDate } from '@/mockData';

interface UserStoryListProps {
  userStories: UserStory[];
  onAddStory?: () => void;
  onEditStory?: (story: UserStory) => void;
}

export function UserStoryList({ userStories, onAddStory, onEditStory }: UserStoryListProps) {
  // Sort user stories by status priority
  const sortedStories = [...userStories].sort((a, b) => {
    const statusPriority: Record<string, number> = {
      'Planning': 1,
      'Ready for dev': 2,
      'Implementing': 3,
      'SIT': 4,
      'Last mile': 5,
      'Done': 6,
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });
  
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'Planning': return 'status-not-started';
      case 'Ready for dev': return 'status-ready-for-dev';
      case 'Implementing': return 'status-implementing';
      case 'SIT': return 'status-sit';
      case 'Last mile': return 'status-last-mile';
      case 'Done': return 'status-done';
      default: return 'status-not-started';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Stories</CardTitle>
        {onAddStory && (
          <Button onClick={onAddStory} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Story
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {userStories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No user stories found for this epic.</p>
            {onAddStory && (
              <Button onClick={onAddStory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Story
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Target End</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStories.map(story => {
                  const assignee = getTeamMemberById(story.assigneeId || '');
                  const statusClass = getStatusClass(story.status);
                  
                  return (
                    <TableRow 
                      key={story.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onEditStory && onEditStory(story)}
                    >
                      <TableCell className="font-medium">{story.id}</TableCell>
                      <TableCell>{story.name}</TableCell>
                      <TableCell>{assignee?.name || 'Unassigned'}</TableCell>
                      <TableCell className="text-center">{story.effortPoints}</TableCell>
                      <TableCell>{formatDate(story.startDate)}</TableCell>
                      <TableCell>{formatDate(story.targetEndDate)}</TableCell>
                      <TableCell>
                        <span className={`status-badge ${statusClass}`}>
                          {story.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
