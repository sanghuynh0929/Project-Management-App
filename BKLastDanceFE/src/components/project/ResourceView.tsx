// src/components/epics/ResourceView.tsx
import React, { useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table.tsx";
import { Card }     from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  useQuery,
  useQueries,
  UseQueryOptions,
  UseQueryResult,
}                   from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { epicService }               from "@/services/epicService.ts";
import { sprintService }             from "@/services/sprintService.ts";
import { resourceAllocationService } from "@/services/resourceAllocationService.ts";
import { personService }             from "@/services/personService.ts";

import {
  Epic,
  Sprint,
  ResourceAllocation,
  Person,
} from "@/types";
import { formatDate } from "@/utils/date.ts";

/* ------------------------------------------------------------------ */
/* PersonAllocationTable – hiển thị FTE mỗi cá nhân theo sprint       */
/* ------------------------------------------------------------------ */
function PersonAllocationTable({
                                 sprints,
                                 raList,
                               }: {
  sprints: Sprint[];
  raList : ResourceAllocation[];
}) {
  const { data: persons = [], isLoading } = useQuery<Person[]>({
    queryKey : ["persons"],
    queryFn  : personService.getAllPersons,
    staleTime: 10 * 60_000,
  });

  /** personId → sprintId → FTE */
  const personSprintFte = useMemo(() => {
    const m: Record<number, Record<number, number>> = {};
    raList.forEach((ra) => {
      if (!m[ra.personId]) m[ra.personId] = {};
      m[ra.personId][ra.sprintId] = (m[ra.personId][ra.sprintId] || 0) + ra.fte;
    });
    return m;
  }, [raList]);

  if (isLoading)
    return (
        <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-64 w-full" />
        </Card>
    );

  if (!persons.length)
    return (
        <p className="text-center py-8 text-muted-foreground">
          No team-member data.
        </p>
    );

  return (
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Team member allocation</h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Member</TableHead>
                  <TableHead className="w-[140px]">Role</TableHead>
                  {sprints.map((sp) => (
                      <TableHead key={sp.id} className="text-center">
                        {sp.name}
                      </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {persons.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.role}</TableCell>

                      {sprints.map((sp) => {
                        const fte = personSprintFte[p.id]?.[sp.id] ?? 0;
                        return (
                            <TableCell key={sp.id} className="text-center">
                              {fte ? fte.toFixed(1) : "-"}
                            </TableCell>
                        );
                      })}
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
  );
}

/* ------------------------------------------------------------------ */
/*                              ResourceView                           */
/* ------------------------------------------------------------------ */
export function ResourceView() {
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  /* 1) épics & sprints ------------------------------------------------ */
  const { data: epics = [],   isLoading: lEpics } = useQuery<Epic[]>({
    queryKey : ["epics", pid],
    queryFn  : () => epicService.getEpicsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  const { data: sprints = [], isLoading: lSpr } = useQuery<Sprint[]>({
    queryKey : ["sprints", pid],
    queryFn  : () => sprintService.getSprintsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  /* 2) allocations – một truy vấn / epic -------------------------------- */
  const raOptions = useMemo<
      readonly UseQueryOptions<ResourceAllocation[]>[]
  >(
      () =>
          epics.map((e) => ({
            queryKey : ["ra", e.id] as const,
            queryFn  : () => resourceAllocationService.getRaByEpic(e.id),
            staleTime: 5 * 60_000,
            enabled  : !!e.id,
          })) as const,
      [epics]
  );

  const raQueries = useQueries({ queries: raOptions }) as UseQueryResult<
      ResourceAllocation[],
      Error
  >[];

  const lRa = raQueries.some((q) => q.isLoading);
  const eRa = raQueries.find((q) => q.isError)?.error;

  /** epicId → allocation[] */
  const raMap = useMemo<Record<number, ResourceAllocation[]>>(() => {
    const m: Record<number, ResourceAllocation[]> = {};
    raQueries.forEach((q, idx) => {
      const id = epics[idx]?.id;
      if (id) m[id] = q.data ?? [];
    });
    return m;
  }, [raQueries, epics]);

  /* 3) FTE tính toán ---------------------------------------------------- */
  const epicSprintFte = useMemo(() => {
    const res: Record<number, Record<number, number>> = {};
    epics.forEach((e) => {
      res[e.id] = {};
      sprints.forEach((sp) => {
        res[e.id][sp.id] = (raMap[e.id] ?? [])
            .filter((ra) => ra.sprintId === sp.id)
            .reduce((sum, ra) => sum + ra.fte, 0);
      });
    });
    return res;
  }, [epics, sprints, raMap]);

  const sprintTotal = useMemo(() => {
    const res: Record<number, number> = {};
    sprints.forEach((sp) => (res[sp.id] = 0));
    Object.values(raMap)
        .flat()
        .forEach((ra) => {
          res[ra.sprintId] += ra.fte;
        });
    return res;
  }, [raMap, sprints]);

  const baseline = 9.1;
  const gap = useMemo(
      () =>
          Object.fromEntries(
              sprints.map((sp) => [sp.id, baseline - (sprintTotal[sp.id] ?? 0)])
          ),
      [sprints, sprintTotal]
  );
  const statusOf = (g: number) =>
      g === 0
          ? { t: "Supplied", cls: "text-green-600" }
          : g > 0
              ? { t: "Not supplied", cls: "text-amber-600" }
              : { t: "Inadequate", cls: "text-red-600" };

  /* 4) trạng thái ------------------------------------------------------- */
  if (lEpics || lSpr || lRa) {
    return (
        <Card className="p-6">
          <Skeleton className="h-64" />
        </Card>
    );
  }
  if (eRa) {
    return (
        <p className="text-center text-red-600">
          Cannot load resource allocation.
        </p>
    );
  }
  if (!epics.length || !sprints.length) {
    return <p className="text-center py-8">No data.</p>;
  }

  /* 5) render ----------------------------------------------------------- */
  const raFlat = Object.values(raMap).flat();

  return (
      <div className="space-y-8">
        {/* ---------- Epic × Sprint matrix ---------- */}
        <Card>
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Resource allocation</h2>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Epic</TableHead>
                    {sprints.map((sp) => (
                        <TableHead key={sp.id} className="text-center">
                          {sp.name}
                          <div className="text-xs text-muted-foreground">
                            {formatDate(sp.startDate)} – {formatDate(sp.endDate)}
                          </div>
                        </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {epics.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.title}</TableCell>
                        {sprints.map((sp) => (
                            <TableCell key={sp.id} className="text-center">
                              {epicSprintFte[e.id][sp.id]
                                  ? epicSprintFte[e.id][sp.id].toFixed(1)
                                  : "-"}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))}

                  {/* Tổng / baseline / gap / status */}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">Total FTE</TableCell>
                    {sprints.map((sp) => (
                        <TableCell
                            key={sp.id}
                            className="text-center font-medium"
                        >
                          {(sprintTotal[sp.id] ?? 0).toFixed(1)}
                        </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Baseline</TableCell>
                    {sprints.map((sp) => (
                        <TableCell key={sp.id} className="text-center">
                          {baseline.toFixed(1)}
                        </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Gap</TableCell>
                    {sprints.map((sp) => (
                        <TableCell key={sp.id} className="text-center">
                          {gap[sp.id].toFixed(1)}
                        </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    {sprints.map((sp) => {
                      const s = statusOf(gap[sp.id]);
                      return (
                          <TableCell
                              key={sp.id}
                              className={`text-center ${s.cls}`}
                          >
                            {s.t}
                          </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* ---------- Team-member view ---------- */}
        <PersonAllocationTable sprints={sprints} raList={raFlat} />
      </div>
  );
}
