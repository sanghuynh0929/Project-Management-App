
import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { CostView } from '@/components/project/CostView.tsx';

const Costs = () => {
  return (
    <MainLayout title="Cost Management">
      <CostView />
    </MainLayout>
  );
};

export default Costs;
