import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PersonSprintTableProps {
  personBySprintData: any[];
  formatHours: (hours: number) => number;
}

const PersonSprintTable: React.FC<PersonSprintTableProps> = ({
  personBySprintData,
  formatHours,
}) => {
  if (personBySprintData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Person by Sprint (per Epic)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              {personBySprintData[0].sprints.map((sprintName: string, idx: number) => (
                <TableHead key={idx}>{sprintName} (h, FTE)</TableHead>
              ))}
              <TableHead>Epic-specific (h)</TableHead>
              <TableHead>Total (h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personBySprintData[0].personRows.map((person: any, personIdx: number) => (
              <TableRow key={personIdx}>
                <TableCell>{person.personName}</TableCell>
                {person.sprintHours.map((s: any, idx: number) => (
                  <TableCell key={idx}>{formatHours(s.totalHours)}h ({formatHours(s.fte)} FTE)</TableCell>
                ))}
                <TableCell>{formatHours(person.epicOnlyHours)}h</TableCell>
                <TableCell>{formatHours(person.total)}h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PersonSprintTable; 