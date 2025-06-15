import React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, DollarSign, Clock } from 'lucide-react';

interface EpicSidebarProps {
  epic: {
    id: number;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  projectId: number;
  currentView: string;
  onViewChange: (view: 'workitems' | 'resources' | 'costs' | 'timeline') => void;
}

const EpicSidebar: React.FC<EpicSidebarProps> = ({ epic, projectId, currentView, onViewChange }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'workitems', label: 'Work Items', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Users },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/projects/${projectId}`)}
          className="w-full justify-start mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Project
        </Button>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{epic.title}</h2>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{epic.description}</p>
          <div className="text-xs text-gray-500">
            <div>Start: {new Date(epic.startDate).toDateString()}</div>
            <div>End: {new Date(epic.endDate).toDateString()}</div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full justify-start ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default EpicSidebar;
