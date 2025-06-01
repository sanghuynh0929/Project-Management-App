
import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BacklogView } from '@/components/epics/BacklogView';
import { ResourceView } from '@/components/epics/ResourceView';
import { CostView } from '@/components/epics/CostView';
import { TimelineView } from '@/components/epics/TimelineView';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeView, setActiveView] = useState<'backlog' | 'resource' | 'cost' | 'timeline'>('backlog');
  const { toast } = useToast();
  
  const handleCreateEpic = () => {
    // This would open a dialog to create a new epic
    toast({
      title: 'Create Epic',
      description: 'Open dialog to create a new epic (to be implemented)',
    });
  };
  
  return (
    <MainLayout
      title="Epic Management"
      showCreateButton={true}
      onCreateClick={handleCreateEpic}
    >
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="backlog">Backlog View</TabsTrigger>
          <TabsTrigger value="resource">Resource View</TabsTrigger>
          <TabsTrigger value="cost">Cost View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backlog">
          <BacklogView />
        </TabsContent>
        
        <TabsContent value="resource">
          <ResourceView />
        </TabsContent>
        
        <TabsContent value="cost">
          <CostView />
        </TabsContent>
        
        <TabsContent value="timeline">
          <TimelineView />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Index;
