
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { ResourceView } from '@/components/project/ResourceView.tsx';

const Resources = () => {
  return (
    <MainLayout title="Resource Management">
      <ResourceView />
    </MainLayout>
  );
};

export default Resources;
