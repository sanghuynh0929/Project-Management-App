// src/components/costs/CostView.tsx
import React, { useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { epicService }   from "@/services/epicService";
import { sprintService } from "@/services/sprintService";
import { costService }   from "@/services/costService";

export function CostView() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  /* ───────────── fetch ───────────── */
  const { data: epics = [],   isLoading: lEpics } = useQuery({
    queryKey : ["epics", pid],
    queryFn  : () => epicService.getEpicsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  const { data: sprints = [], isLoading: lSpr } = useQuery({
    queryKey : ["sprints", pid],
    queryFn  : () => sprintService.getSprintsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  const { data: costs = [],   isLoading: lCosts } = useQuery({
    queryKey : ["costs", pid],
    queryFn  : () => costService.getCostsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  /* ───────────── tính toán ───────────── */
  /** map nhanh Epic theo id */
  const epicMap = useMemo(
      () => Object.fromEntries(epics.map(e => [e.id, e])),
      [epics],
  );

  /** costsByType[epicId][type][sprintId] = amount */
  const costsByType = useMemo(() => {
    const res: Record<number, Record<string, Record<number, number>>> = {};
    costs.forEach(c => {
      if (!res[c.epicId]) res[c.epicId] = { "Cloud Cost": {}, Outsource: {}, Other: {} };
      if (!res[c.epicId][c.type][c.sprintId]) res[c.epicId][c.type][c.sprintId] = 0;
      res[c.epicId][c.type][c.sprintId] += c.amount;
    });
    return res;
  }, [costs]);

  /** tổng chi phí cho từng epic */
  const totalCosts = useMemo(() => {
    const res: Record<number, number> = {};
    costs.forEach(c => {
      res[c.epicId] = (res[c.epicId] || 0) + c.amount;
    });
    return res;
  }, [costs]);

  /** tổng theo sprint */
  const sprintTotals = useMemo(() => {
    const res: Record<number, number> = {};
    costs.forEach(c => {
      res[c.sprintId] = (res[c.sprintId] || 0) + c.amount;
    });
    return res;
  }, [costs]);

  const grandTotal = costs.reduce((s, c) => s + c.amount, 0);

  /* ───────────── UI ───────────── */
  if (lEpics || lSpr || lCosts) {
    return (
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </Card>
    );
  }

  if (!epics.length || !sprints.length) {
    return <p className="text-center py-12">No cost data available.</p>;
  }

  const TYPES = ["Cloud Cost", "Outsource", "Other"] as const;

  return (
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Cost Management by Epic and Sprint
          </h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Epic</TableHead>
                  <TableHead className="w-[130px]">Cost type</TableHead>
                  {sprints.map(sp => (
                      <TableHead key={sp.id} className="text-center">
                        {sp.name}
                      </TableHead>
                  ))}
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {epics.flatMap(epic =>
                    TYPES.map((type, idx) => (
                        <TableRow key={`${epic.id}-${type}`}>
                          {idx === 0 && (
                              <TableCell rowSpan={TYPES.length} className="align-middle font-medium">
                                {epic.title}
                                <span className="text-xs text-muted-foreground ml-1">
                          ({epic.id})
                        </span>
                              </TableCell>
                          )}
                          <TableCell>{type}</TableCell>
                          {sprints.map(sp => {
                            const amt = costsByType[epic.id]?.[type]?.[sp.id] || 0;
                            return (
                                <TableCell key={sp.id} className="text-center">
                                  {amt ? `$${amt.toLocaleString()}` : "-"}
                                </TableCell>
                            );
                          })}
                          <TableCell className="text-center font-medium">
                            $
                            {Object.values(costsByType[epic.id]?.[type] ?? {})
                                .reduce((s, v) => s + v, 0)
                                .toLocaleString()}
                          </TableCell>
                        </TableRow>
                    ))
                )}

                {/* total row */}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-medium">
                    Total
                  </TableCell>
                  {sprints.map(sp => (
                      <TableCell key={sp.id} className="text-center font-medium">
                        ${sprintTotals[sp.id]?.toLocaleString() || "0"}
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
