// src/components/project/CostView.tsx
import React, { useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'react-router-dom';

import { useProject } from '@/hooks/useProject';
import type { WorkItem } from '@/types';

/* ────────────────────────────────────────────────────────── */

export function CostView() {
  /* Project ID */
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  /* Dữ liệu */
  const {
    epics,
    sprints,
    workItemsByEpic,
    isLoadingEpics,
    isLoadingSprints,
    isLoadingWorkItems,
    isError,
    error,
  } = useProject(pid);

  /* Map workItemId → sprintId */
  const wiToSprint = useMemo<Record<number, number>>(() => {
    const m: Record<number, number> = {};
    Object.values(workItemsByEpic).flat().forEach(wi => (m[wi.id] = wi.sprintId));
    return m;
  }, [workItemsByEpic]);

  /* Tính chi phí */
  const costTypes = ['Cloud Cost', 'Outsource', 'Other'] as const;

  const costsByType = useMemo(() => {
    const res: Record<number, Record<(typeof costTypes)[number], Record<number, number>>> = {};
    epics.forEach(epic => {
      const bucket = (res[epic.id] = { 'Cloud Cost': {}, Outsource: {}, Other: {} });
      epic.costs?.forEach(c => {
        const spId = wiToSprint[c.workItemId];
        if (!spId) return;
        bucket[c.type][spId] = (bucket[c.type][spId] ?? 0) + c.amount;
      });
    });
    return res;
  }, [epics, wiToSprint]);

  const sprintTotals = useMemo(() => {
    const r: Record<number, number> = {};
    sprints.forEach(sp => (r[sp.id] = 0));
    epics.forEach(e => {
      Object.values(costsByType[e.id] || {}).forEach(bySprint => {
        Object.entries(bySprint).forEach(([spId, amt]) => (r[+spId] += amt));
      });
    });
    return r;
  }, [sprints, epics, costsByType]);

  const grandTotal = useMemo(
      () => Object.values(sprintTotals).reduce((s, v) => s + v, 0),
      [sprintTotals],
  );

  /* UI states */
  if (isError) {
    return <p className="text-destructive p-4">{String(error)}</p>;
  }
  if (isLoadingEpics || isLoadingSprints || isLoadingWorkItems) {
    return <Card className="p-6"><Skeleton className="h-64" /></Card>;
  }
  if (!epics.length || !sprints.length) {
    return <p className="text-center py-8">No cost data.</p>;
  }

  /* Render */
  return (
      <Card>
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Cost Management by Epic &amp; Sprint</h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Epic</TableHead>
                  <TableHead className="w-[120px]">Cost Type</TableHead>
                  {sprints.map(sp => (
                      <TableHead key={sp.id} className="text-center">{sp.name}</TableHead>
                  ))}
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {epics.flatMap(epic =>
                    costTypes.map(type => (
                        <TableRow key={`${epic.id}-${type}`}>
                          {type === 'Cloud Cost' && (
                              <TableCell rowSpan={costTypes.length} className="align-middle font-medium">
                                {epic.title} <span className="text-xs text-muted-foreground">({epic.id})</span>
                              </TableCell>
                          )}
                          <TableCell>{type}</TableCell>

                          {sprints.map(sp => (
                              <TableCell key={sp.id} className="text-center">
                                {costsByType[epic.id]?.[type]?.[sp.id]
                                    ? `$${costsByType[epic.id][type][sp.id].toLocaleString()}`
                                    : '-'}
                              </TableCell>
                          ))}

                          <TableCell className="text-center font-medium">
                            ${Object.values(costsByType[epic.id]?.[type] || {})
                              .reduce((s, v) => s + v, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                    )),
                )}

                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-medium">Total</TableCell>
                  {sprints.map(sp => (
                      <TableCell key={sp.id} className="text-center font-medium">
                        ${sprintTotals[sp.id]?.toLocaleString() || '0'}
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
  );
}
