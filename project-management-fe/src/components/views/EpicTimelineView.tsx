
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EpicTimelineViewProps {
  epicId: number;
}

// Mock timeline data for single epic
const mockEpicTimelineData = {
  id: 1,
  title: "User Authentication System",
  startDate: "2024-01-15",
  endDate: "2024-02-28",
  status: "In Progress",
  progress: 65,
  workItems: [
    {
      id: 1,
      title: "Login Form Design",
      startDate: "2024-01-15",
      endDate: "2024-01-22",
      status: "Completed",
      assignee: "Jane Smith"
    },
    {
      id: 2,
      title: "Authentication API",
      startDate: "2024-01-20",
      endDate: "2024-02-05",
      status: "In Progress",
      assignee: "John Doe"
    },
    {
      id: 3,
      title: "Password Reset Flow",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      status: "In Progress",
      assignee: "John Doe"
    },
    {
      id: 4,
      title: "User Registration",
      startDate: "2024-02-10",
      endDate: "2024-02-28",
      status: "Not Started",
      assignee: "Mike Johnson"
    },
    {
      id: 5,
      title: "Two-Factor Authentication",
      startDate: "2024-02-20",
      endDate: "2024-03-05",
      status: "Not Started",
      assignee: "John Doe"
    }
  ]
};

const EpicTimelineView: React.FC<EpicTimelineViewProps> = ({ epicId }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Not Started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getDatePosition = (startDate: string, endDate: string) => {
    const epicStart = new Date('2024-01-15');
    const epicEnd = new Date('2024-03-05');
    const epicDuration = epicEnd.getTime() - epicStart.getTime();
    
    const itemStart = new Date(startDate);
    const itemEnd = new Date(endDate);
    
    const startPosition = ((itemStart.getTime() - epicStart.getTime()) / epicDuration) * 100;
    const width = ((itemEnd.getTime() - itemStart.getTime()) / epicDuration) * 100;
    
    return { left: `${Math.max(0, startPosition)}%`, width: `${Math.max(1, width)}%` };
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Epic Timeline</h1>
        <p className="text-gray-600">Detailed timeline view of work items within this epic</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Item Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeline Header */}
            <div className="flex justify-between text-sm text-gray-500 border-b pb-2">
              <span>Jan 15</span>
              <span>Feb 1</span>
              <span>Feb 15</span>
              <span>Mar 1</span>
              <span>Mar 5</span>
            </div>

            {/* Epic Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-64 flex-shrink-0">
                  <div className="font-semibold text-gray-900">{mockEpicTimelineData.title}</div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    Epic Progress
                  </Badge>
                </div>
                <div className="flex-1 relative h-8 bg-gray-100 rounded">
                  <div 
                    className="absolute h-full rounded bg-blue-500 opacity-80"
                    style={{ width: '100%' }}
                  >
                    <div className="h-full bg-white bg-opacity-20 rounded">
                      <div 
                        className="h-full bg-current rounded transition-all duration-300"
                        style={{ width: `${mockEpicTimelineData.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    {mockEpicTimelineData.progress}%
                  </div>
                </div>
              </div>
            </div>

            {/* Work Items */}
            <div className="space-y-3">
              {mockEpicTimelineData.workItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-64 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{item.assignee}</span>
                    </div>
                  </div>
                  <div className="flex-1 relative h-6 bg-gray-50 rounded">
                    <div 
                      className={`absolute h-full rounded ${getStatusColor(item.status)}`}
                      style={getDatePosition(item.startDate, item.endDate)}
                    />
                    <div className="absolute inset-0 flex items-center text-xs text-gray-600 px-2">
                      {new Date(item.startDate).toDateString()} - {new Date(item.endDate).toDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Epic Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mockEpicTimelineData.progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${mockEpicTimelineData.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockEpicTimelineData.workItems.filter(item => item.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockEpicTimelineData.workItems.filter(item => item.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Days Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.ceil((new Date('2024-02-28').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EpicTimelineView;
