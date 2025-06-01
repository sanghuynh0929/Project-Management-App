
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { CostView } from '@/components/epics/CostView';

const Costs = () => {
  return (
    <MainLayout title="Cost Management">
      <CostView />
    </MainLayout>
  );
};

export default Costs;
