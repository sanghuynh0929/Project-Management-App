import React, { useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'react-router-dom';

import { useProject } from '@/hooks/useProject';

const COST_TYPES = ['Cloud Cost', 'Outsource', 'Other'] as const;

export function CostView() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  const {
    epics, sprints, workItems, costs,
    isLoading, isError, error,
  } = useProject(pid);

  /* Map workItemId ➜ sprintId */
  const wiToSprint = useMemo<Record<number, number>>(() => {
    const m: Record<number, number> = {};
    workItems.forEach(wi => { m[wi.id] = wi.sprintId; });
    return m;
  }, [workItems]);

  /* Gom chi phí theo [epic][type][sprint] */
  const costsByType = useMemo(() => {
    const r: Record<number,
        Record<(typeof COST_TYPES)[number], Record<number, number>>> = {};
    epics.forEach(e => {
      r[e.id] = { 'Cloud Cost': {}, Outsource: {}, Other: {} };
    });
    costs.forEach(c => {
      const spId = wiToSprint[c.workItemId];
      if (!spId) return;                                  // workItem chưa có sprint
      const bucket = r[c.epicId]?.[c.type];
      if (bucket) bucket[spId] = (bucket[spId] ?? 0) + c.amount;
    });
    return r;
  }, [costs, epics, wiToSprint]);

  /* Tổng chi phí mỗi sprint */
  const sprintTotals = useMemo(() => {
    const res: Record<number, number> = {};
    sprints.forEach(sp => (res[sp.id] = 0));
    Object.values(costsByType).forEach(byType => {
      Object.values(byType).forEach(bySprint => {
        Object.entries(bySprint).forEach(([spId, amt]) => {
          res[+spId] += amt;
        });
      });
    });
    return res;
  }, [costsByType, sprints]);

  const grandTotal = useMemo(
      () => Object.values(sprintTotals).reduce((sum, v) => sum + v, 0),
      [sprintTotals],
  );

  /* UI states */
  if (isError) return <p className="text-destructive p-4">{String(error)}</p>;
  if (isLoading) return <Card className="p-6"><Skeleton className="h-64" /></Card>;
  if (!epics.length || !sprints.length) return <p className="text-center py-8">No cost data.</p>;

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
                  <TableHead className="w-[130px]">Cost Type</TableHead>
                  {sprints.map(sp => (
                      <TableHead key={sp.id} className="text-center">{sp.name}</TableHead>
                  ))}
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {epics.flatMap(epic =>
                    COST_TYPES.map(type => (
                        <TableRow key={`${epic.id}-${type}`}>
                          {type === 'Cloud Cost' && (
                              <TableCell rowSpan={COST_TYPES.length} className="align-middle font-medium">
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
