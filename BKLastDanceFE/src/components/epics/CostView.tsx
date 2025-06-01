
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { epicService } from '@/services/epicService';
import { costService } from '@/services/costService';
import { sprintService } from '@/services/sprintService';
import { Skeleton } from '@/components/ui/skeleton';
import {useParams} from "react-router-dom";

export function CostView() {
  const queryClient = useQueryClient();
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  const { data: epics, isLoading: isLoadingEpics } = useQuery({
    queryKey: ["epics"],
    queryFn: epicService.getAllEpics,
  });

  const { data: sprints, isLoading: isLoadingSprints } = useQuery({
    queryKey: ["sprints"],
    queryFn: async () => {
      try {
        // Use the mock data directly from sprintService
        return sprintService.getSprintsByProject(pid);
      } catch (error) {
        console.error("Failed to fetch sprints:", error);
        return []; // Return empty array if fetch fails
      }
    },
  });

  // Calculate costs by type and sprint
  const calculateCostsByType = () => {
    if (!epics || epics.length === 0) return {};

    const result: Record<string, Record<string, Record<string, number>>> = {};

    epics.forEach(epic => {
      if (!epic || !epic.costs) return; // Skip if epic or costs is undefined

      result[epic.id] = {
        Cloud: {},
        Outsource: {},
        Other: {}
      };

      epic.costs.forEach(cost => {
        if (!cost || !cost.sprintId) return; // Skip if cost or sprintId is undefined

        if (!result[epic.id][cost.type][cost.sprintId]) {
          result[epic.id][cost.type][cost.sprintId] = 0;
        }
        result[epic.id][cost.type][cost.sprintId] += cost.amount;
      });
    });

    return result;
  };

  const costsByType = calculateCostsByType();

  // Calculate total costs for each epic
  const calculateTotalCosts = () => {
    if (!epics || epics.length === 0) return {};

    const result: Record<string, number> = {};

    epics.forEach(epic => {
      if (!epic || !epic.costs) {
        result[epic.id] = 0;
        return;
      }

      result[epic.id] = epic.costs.reduce((sum, cost) => sum + cost.amount, 0);
    });

    return result;
  };

  const totalCosts = calculateTotalCosts();

  // Calculate total costs for each sprint
  const calculateSprintTotals = () => {
    if (!epics || !sprints || epics.length === 0 || sprints.length === 0) return {};

    const result: Record<string, number> = {};

    sprints.forEach(sprint => {
      result[sprint.id] = epics.reduce((sum, epic) => {
        if (!epic.costs) return sum;

        return sum + epic.costs
            .filter(cost => cost.sprintId === sprint.id)
            .reduce((costSum, cost) => costSum + cost.amount, 0);
      }, 0);
    });

    return result;
  };

  const sprintTotals = calculateSprintTotals();

  // Grand total
  const grandTotal = Object.values(totalCosts).reduce((sum, cost) => sum + cost, 0);

  if (isLoadingEpics || isLoadingSprints) {
    return (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="overflow-x-auto">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </Card>
        </div>
    );
  }

  if (!epics || !sprints || epics.length === 0 || sprints.length === 0) {
    return (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            No cost data available. Please add epics and sprints to view cost data.
          </p>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Cost Management by Epic and Sprint</h2>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Epic</TableHead>
                    <TableHead className="w-[100px]">Cost Type</TableHead>
                    {sprints.map(sprint => (
                        <TableHead key={sprint.id} className="text-center">
                          {sprint.name}
                        </TableHead>
                    ))}
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {epics.flatMap(epic => {
                    const types = ['Cloud', 'Outsource', 'Other'] as const;

                    return types.map(type => (
                        <TableRow key={`${epic.id}-${type}`}>
                          {type === 'Cloud' && (
                              <TableCell rowSpan={3} className="align-middle font-medium">
                                {epic.title} <span className="text-xs text-muted-foreground ml-1">({epic.id})</span>
                              </TableCell>
                          )}
                          <TableCell>{type}</TableCell>

                          {sprints.map(sprint => {
                            const cost = costsByType[epic.id]?.[type]?.[sprint.id] || 0;
                            return (
                                <TableCell key={sprint.id} className="text-center">
                                  {cost > 0 ? `$${cost.toLocaleString()}` : '-'}
                                </TableCell>
                            );
                          })}

                          <TableCell className="text-center font-medium">
                            ${Object.values(costsByType[epic.id]?.[type] || {})
                              .reduce((sum, cost) => sum + cost, 0)
                              .toLocaleString()}
                          </TableCell>
                        </TableRow>
                    ));
                  })}

                  {/* Total row */}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-medium">
                      Total
                    </TableCell>
                    {sprints.map(sprint => (
                        <TableCell key={sprint.id} className="text-center font-medium">
                          ${sprintTotals[sprint.id]?.toLocaleString() || "0"}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-medium">
                      ${grandTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
  );
}