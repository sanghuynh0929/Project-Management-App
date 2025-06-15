import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineViewProps {
  projectId: number;
}

// Mock timeline data
const mockTimelineData = [
  {
    id: 1,
    title: "User Authentication System",
    type: "epic",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    status: "In Progress",
    progress: 65,
    workItems: [
      { id: 1, title: "Login Form Design", startDate: "2024-01-15", endDate: "2024-01-22", status: "Completed" },
      { id: 2, title: "Authentication API", startDate: "2024-01-20", endDate: "2024-02-05", status: "In Progress" },
      { id: 3, title: "Password Reset Flow", startDate: "2024-02-01", endDate: "2024-02-15", status: "In Progress" },
      { id: 4, title: "User Registration", startDate: "2024-02-10", endDate: "2024-02-28", status: "Not Started" }
    ]
  },
  {
    id: 2,
    title: "Product Catalog Redesign",
    type: "epic",
    startDate: "2024-02-01",
    endDate: "2024-03-15",
    status: "Planning",
    progress: 20,
    workItems: [
      { id: 5, title: "Product Page Wireframes", startDate: "2024-02-01", endDate: "2024-02-08", status: "Completed" },
      { id: 6, title: "Search Functionality", startDate: "2024-02-10", endDate: "2024-02-25", status: "Not Started" },
      { id: 7, title: "Product Filters", startDate: "2024-02-20", endDate: "2024-03-05", status: "Not Started" },
      { id: 8, title: "Catalog API Integration", startDate: "2024-03-01", endDate: "2024-03-15", status: "Not Started" }
    ]
  }
];

const ProjectTimelineView: React.FC<TimelineViewProps> = ({ projectId }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Not Started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getDatePosition = (startDate: string, endDate: string) => {
    const projectStart = new Date('2024-01-15');
    const projectEnd = new Date('2024-03-15');
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    
    const itemStart = new Date(startDate);
    const itemEnd = new Date(endDate);
    
    const startPosition = ((itemStart.getTime() - projectStart.getTime()) / projectDuration) * 100;
    const width = ((itemEnd.getTime() - itemStart.getTime()) / projectDuration) * 100;
    
    return { left: `${Math.max(0, startPosition)}%`, width: `${Math.max(1, width)}%` };
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
        <p className="text-gray-600">Visualize project progress with Gantt chart view</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gantt Chart - Epics and Work Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeline Header */}
            <div className="flex justify-between text-sm text-gray-500 border-b pb-2">
              <span>Jan 2024</span>
              <span>Feb 2024</span>
              <span>Mar 2024</span>
            </div>

            {mockTimelineData.map((epic) => (
              <div key={epic.id} className="space-y-2">
                {/* Epic Row */}
                <div className="flex items-center space-x-4">
                  <div className="w-64 flex-shrink-0">
                    <div className="font-semibold text-gray-900">{epic.title}</div>
                    <Badge className={`text-xs ${epic.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {epic.status}
                    </Badge>
                  </div>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded">
                    <div 
                      className={`absolute h-full rounded ${getStatusColor(epic.status)} opacity-80`}
                      style={getDatePosition(epic.startDate, epic.endDate)}
                    >
                      <div className="h-full bg-white bg-opacity-20 rounded">
                        <div 
                          className="h-full bg-current rounded transition-all duration-300"
                          style={{ width: `${epic.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                      {epic.progress}%
                    </div>
                  </div>
                </div>

                {/* Work Items */}
                <div className="ml-8 space-y-1">
                  {epic.workItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-56 flex-shrink-0">
                        <div className="text-sm text-gray-700">{item.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex-1 relative h-4 bg-gray-50 rounded">
                        <div 
                          className={`absolute h-full rounded ${getStatusColor(item.status)}`}
                          style={getDatePosition(item.startDate, item.endDate)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">42%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Days Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">28</div>
            <div className="text-sm text-gray-500">Until project completion</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3/7</div>
            <div className="text-sm text-gray-500">Completed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectTimelineView;

