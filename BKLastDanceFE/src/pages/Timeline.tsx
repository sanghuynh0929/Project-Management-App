
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { TimelineView } from '@/components/project/TimelineView.tsx';

const Timeline = () => {
  return (
    <MainLayout title="Timeline">
      <TimelineView />
    </MainLayout>
  );
};

export default Timeline;
