
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { AlertTriangle } from 'lucide-react';

const Issues = () => {
  return (
    <MainLayout title="Issues & Risks">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">Issues & Risks Tracking</h2>
        </div>
        <p className="text-muted-foreground">
          This page will display project issues and risks with their status, severity, 
          and mitigation plans. Currently under development.
        </p>
      </div>
    </MainLayout>
  );
};

export default Issues;
