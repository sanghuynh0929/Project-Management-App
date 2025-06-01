
import React from 'react';
import { MainLayout } from '@/components/MainLayout';

const Sprints = () => {
  return (
    <MainLayout title="Sprint Management">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Sprint Overview</h2>
        <p className="text-muted-foreground">
          Sprint management dashboard coming soon. This page will contain sprint planning, 
          tracking, and retrospective features.
        </p>
      </div>
    </MainLayout>
  );
};

export default Sprints;
