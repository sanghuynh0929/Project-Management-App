
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Plus } from 'lucide-react';

interface WorkItemViewProps {
  epicId: number;
}

// Mock work item data
const mockWorkItems = [
  {
    id: 1,
    title: "Design Login Form",
    description: "Create wireframes and mockups for the user login interface",
    status: "Completed",
    priority: "High",
    type: "Design",
    storyPoints: 5,
    location: "Sprint 1"
  },
  {
    id: 2,
    title: "Implement Authentication API",
    description: "Develop backend API endpoints for user authentication",
    status: "In Progress",
    priority: "High",
    type: "Development",
    storyPoints: 8,
    location: "Sprint 1"
  },
  {
    id: 3,
    title: "Create Password Reset Flow",
    description: "Implement password reset functionality with email verification",
    status: "In Progress",
    priority: "Medium",
    type: "Development",
    storyPoints: 5,
    location: "Sprint 2"
  },
  {
    id: 4,
    title: "Add Two-Factor Authentication",
    description: "Implement 2FA using SMS or authenticator apps",
    status: "Not Started",
    priority: "Low",
    type: "Feature",
    storyPoints: 13,
    location: "Backlog"
  }
];

const WorkItemView: React.FC<WorkItemViewProps> = ({ epicId }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Development': return 'bg-blue-100 text-blue-800';
      case 'Design': return 'bg-purple-100 text-purple-800';
      case 'Feature': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Items</h1>
          <p className="text-gray-600">Manage tasks and track progress within this epic</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Work Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockWorkItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </CardTitle>
                <Badge className={`ml-2 text-xs ${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              </div>
              <CardDescription className="text-sm text-gray-600 line-clamp-3">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  <Badge className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Story Points:</span>
                  <Badge variant="outline">{item.storyPoints}</Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Location:</span>
                  <Badge variant="secondary">{item.location}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Work Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockWorkItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Story Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockWorkItems.reduce((sum, item) => sum + item.storyPoints, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockWorkItems.filter(item => item.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockWorkItems.filter(item => item.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkItemView;
