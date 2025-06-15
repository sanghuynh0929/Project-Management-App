
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EpicSidebar from '../layout/EpicSidebar.tsx';
import WorkItemView from '../views/WorkItemView.tsx';
import EpicResourceView from '../views/EpicResourceView';
import EpicCostView from '../views/EpicCostView';
import EpicTimelineView from '../views/EpicTimelineView';

type ViewType = 'workitems' | 'resources' | 'costs' | 'timeline';

const EpicDetail = () => {
  const { projectId, epicId } = useParams();
  const [currentView, setCurrentView] = useState<ViewType>('workitems');

  // Mock epic data
  const epic = {
    id: parseInt(epicId || '1'),
    title: "User Authentication System",
    description: "Implement secure user login, registration, and password management",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    status: "In Progress"
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'workitems':
        return <WorkItemView epicId={epic.id} />;
      case 'resources':
        return <EpicResourceView epicId={epic.id} />;
      case 'costs':
        return <EpicCostView epicId={epic.id} />;
      case 'timeline':
        return <EpicTimelineView epicId={epic.id} />;
      default:
        return <WorkItemView epicId={epic.id} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EpicSidebar 
        epic={epic}
        projectId={parseInt(projectId || '1')}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default EpicDetail;
