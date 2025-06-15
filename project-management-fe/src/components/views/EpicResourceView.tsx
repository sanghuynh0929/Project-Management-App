
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface EpicResourceViewProps {
  epicId: number;
}

// Mock resource data for epic
const mockEpicResourceData = [
  {
    personName: "John Doe",
    role: "Senior Developer",
    workItems: [
      { name: "Authentication API", hours: 32, description: "Backend development" },
      { name: "Login Form Integration", hours: 16, description: "Frontend integration" }
    ],
    totalHours: 48
  },
  {
    personName: "Jane Smith",
    role: "UI/UX Designer", 
    workItems: [
      { name: "Login Form Design", hours: 24, description: "UI design and wireframing" },
      { name: "User Flow Documentation", hours: 8, description: "Process documentation" }
    ],
    totalHours: 32
  },
  {
    personName: "Mike Johnson",
    role: "QA Engineer",
    workItems: [
      { name: "Authentication Testing", hours: 20, description: "Manual and automated testing" }
    ],
    totalHours: 20
  }
];

const EpicResourceView: React.FC<EpicResourceViewProps> = ({ epicId }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Epic Resource Allocation</h1>
        <p className="text-gray-600">Track resource allocation and hours for this epic</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Hours by Person and Work Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Work Item</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Total Person Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEpicResourceData.map((person, personIndex) => (
                person.workItems.map((workItem, workItemIndex) => (
                  <TableRow key={`${personIndex}-${workItemIndex}`}>
                    {workItemIndex === 0 && (
                      <>
                        <TableCell rowSpan={person.workItems.length} className="font-medium border-r">
                          {person.personName}
                        </TableCell>
                        <TableCell rowSpan={person.workItems.length} className="border-r">
                          <Badge variant="secondary">{person.role}</Badge>
                        </TableCell>
                      </>
                    )}
                    <TableCell>{workItem.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {workItem.hours}h
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {workItem.description}
                    </TableCell>
                    {workItemIndex === 0 && (
                      <TableCell rowSpan={person.workItems.length} className="text-right font-semibold border-l">
                        <Badge className="bg-green-100 text-green-800">
                          {person.totalHours}h
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Epic Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">100h</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Hours per Person</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">33h</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Work Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EpicResourceView;
