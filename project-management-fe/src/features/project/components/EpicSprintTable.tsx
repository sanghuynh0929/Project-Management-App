import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EpicSprintTableProps {
  epicResourceData: any[];
  formatHours: (hours: number) => number;
  getPersonName: (personId: number) => string;
  onReallocate: (data: {
    epicId: number;
    personId: number;
    personName: string;
    epicAssignment: any;
  }) => void;
}

const EpicSprintTable: React.FC<EpicSprintTableProps> = ({
  epicResourceData,
  formatHours,
  getPersonName,
  onReallocate,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Hours by Epic and Sprint</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Epic</TableHead>
              <TableHead>Sprint</TableHead>
              <TableHead>Hours (FTE)</TableHead>
              <TableHead>People</TableHead>
              <TableHead className="text-right">Total Epic Hours (FTE)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {epicResourceData.flatMap((epic, epicIndex) => [
              ...epic.sprints.map((sprint: any, sprintIndex: number) => (
                <TableRow key={`${epicIndex}-sprint-${sprintIndex}`}>
                  {sprintIndex === 0 && (
                    <TableCell rowSpan={epic.sprints.length + (epic.epicOnly.totalHours > 0 ? 1 : 0)} className="font-medium border-r">
                      {epic.epicName}
                    </TableCell>
                  )}
                  <TableCell>{sprint.sprintName}</TableCell>
                  <TableCell>
                    {formatHours(sprint.totalHours)}h ({formatHours(sprint.fte)} FTE)
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {sprint.assignments?.map((assignment: any, personIndex: number) => (
                        <Badge key={personIndex} variant="secondary" className="text-xs">
                          {getPersonName(assignment.personId)} ({formatHours(assignment.hours)}h)
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {sprintIndex === 0 && (
                    <TableCell rowSpan={epic.sprints.length + (epic.epicOnly.totalHours > 0 ? 1 : 0)} className="text-right font-semibold border-l">
                      {formatHours(epic.totalEpicHours)}h ({formatHours(epic.totalEpicFte)} FTE)
                    </TableCell>
                  )}
                </TableRow>
              )),
              epic.epicOnly.totalHours > 0 && (
                <TableRow key={`${epicIndex}-epiconly`}>
                  <TableCell>Epic Only</TableCell>
                  <TableCell>
                    {formatHours(epic.epicOnly.totalHours)}h ({formatHours(epic.epicOnly.fte)} FTE)
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {epic.epicOnly.assignments.map((assignment: any, personIndex: number) => (
                        <div key={personIndex} className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {getPersonName(assignment.personId)} ({formatHours(assignment.hours)}h)
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-blue-600 hover:text-blue-800"
                            onClick={() => onReallocate({
                              epicId: epic.id,
                              personId: assignment.personId,
                              personName: getPersonName(assignment.personId),
                              epicAssignment: assignment,
                            })}
                          >
                            Reallocate
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )
            ].filter(Boolean))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EpicSprintTable; 