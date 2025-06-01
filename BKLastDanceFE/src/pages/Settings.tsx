
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  return (
    <MainLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integration">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <p className="text-muted-foreground">
              Project settings will be configured here. Customize the project details, 
              sprint lengths, and other general configurations.
            </p>
          </TabsContent>
          
          <TabsContent value="team" className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Team Settings</h2>
            <p className="text-muted-foreground">
              Manage team members, roles, and permissions for the project.
            </p>
          </TabsContent>
          
          <TabsContent value="notifications" className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <p className="text-muted-foreground">
              Configure email and in-app notifications for various project events.
            </p>
          </TabsContent>
          
          <TabsContent value="integration" className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
            <p className="text-muted-foreground">
              Connect with external tools like Jira, GitHub, or other project management tools.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
