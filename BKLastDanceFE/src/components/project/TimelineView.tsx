import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Skeleton }                     from '@/components/ui/skeleton.tsx';
import { useQuery }                     from '@tanstack/react-query';
import { useParams }                    from 'react-router-dom';
import { formatDate }                   from '@/utils/date.ts';
import { epicService }                  from '@/services/epicService.ts';
import { sprintService }                from '@/services/sprintService.ts';
import { Epic, Sprint }                 from '@/types';

export function TimelineView() {
  /* ────────── basic data */
  const { projectId } = useParams<{ projectId: string }>();
  const pid = Number(projectId);

  const { data: epics = [],   isLoading: lEpic } = useQuery<Epic[]>({
    queryKey : ['epics', pid],
    queryFn  : () => epicService.getEpicsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  const { data: sprints = [], isLoading: lSpr } = useQuery<Sprint[]>({
    queryKey : ['sprints', pid],
    queryFn  : () => sprintService.getSprintsByProject(pid),
    enabled  : !Number.isNaN(pid),
  });

  /* ────────── build timeline date-matrix */
  const sortedDates = useMemo<Date[]>(() => {
    if (!sprints.length) return [];
    const all: Date[] = [];
    sprints.forEach(sp => {
      if (!sp.startDate || !sp.endDate) return;
      const start = new Date(sp.startDate);
      const end   = new Date(sp.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1))
        all.push(new Date(d));
    });
    return [...new Set(all.map(d => d.toISOString()))]          // dedupe
        .map(s => new Date(s))
        .sort((a, b) => a.getTime() - b.getTime());
  }, [sprints]);

  /** sprint-id → tất cả date trong sprint */
  const datesBySprintId = useMemo<Record<number, Date[]>>(() => {
    const map: Record<number, Date[]> = {};
    sprints.forEach(sp => {
      if (!sp.startDate || !sp.endDate) { map[sp.id] = []; return; }
      const start = new Date(sp.startDate);
      const end   = new Date(sp.endDate);
      map[sp.id]  = sortedDates.filter(d => d >= start && d <= end);
    });
    return map;
  }, [sortedDates, sprints]);

  const sprintColSpans = useMemo(
      () => sprints.map(sp => datesBySprintId[sp.id]?.length || 1),
      [sprints, datesBySprintId],
  );

  /* ────────── helpers */
  const isDateInEpic = (d: Date, e: Epic) =>
      new Date(e.startDate) <= d && d <= new Date(e.endDate);      // ✔ dùng endDate

  const isSprintStart = (d: Date) =>
      sprints.some(sp => new Date(sp.startDate).getTime() === d.getTime());

  const colorOf = (status: Epic['status']) => ({
    NOT_STARTED        : 'bg-gray-300',
    BACKLOG_REFINEMENT : 'bg-velocity-purple',
    READY_FOR_DEV      : 'bg-velocity-indigo',
    IMPLEMENTING       : 'bg-velocity-blue',
    SIT                : 'bg-velocity-sky',
    LAST_MILE          : 'bg-velocity-orange',
    DONE               : 'bg-velocity-green',
    CANCELLED          : 'bg-velocity-red',
  }[status as keyof typeof EpicStatusMap] ?? 'bg-gray-300');

  /* ────────── ui states */
  if (lEpic || lSpr) {
    return (
        <Card className="p-6"><Skeleton className="h-64" /></Card>
    );
  }
  if (!epics.length || !sprints.length) {
    return <p className="text-center py-8">No timeline data.</p>;
  }

  /* ────────── render */
  return (
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project timeline (Gantt)</h2>

            <div className="overflow-x-auto">
              <Table>
                {/* ───── header ───── */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0   bg-background z-20">Epic</TableHead>
                    <TableHead className="sticky left-[200px] bg-background z-20">Start</TableHead>
                    <TableHead className="sticky left-[350px] bg-background z-20">End</TableHead>
                    <TableHead className="sticky left-[500px] bg-background z-20">Dependencies</TableHead>

                    {sprints.map((sp, i) => (
                        <TableHead
                            key={sp.id}
                            colSpan={sprintColSpans[i]}
                            className="text-center border-x border-gray-200"
                        >
                          {sp.name}
                        </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* ───── body ───── */}
                <TableBody>
                  {epics.map(epic => {
                    const deps = (epic.dependencies ?? [])
                        .map(id => epics.find(e => e.id === id)?.title)
                        .filter(Boolean);

                    return (
                        <TableRow key={epic.id}>
                          {/* fixed columns */}
                          <TableCell className="sticky left-0 bg-background font-medium z-10">
                            {epic.title}
                          </TableCell>
                          <TableCell className="sticky left-[200px] bg-background z-10">
                            {formatDate(epic.startDate)}
                          </TableCell>
                          <TableCell className="sticky left-[350px] bg-background z-10">
                            {formatDate(epic.endDate)}
                          </TableCell>
                          <TableCell className="sticky left-[500px] bg-background z-10">
                            {deps.length ? deps.join(', ') : '—'}
                          </TableCell>

                          {/* gantt cells */}
                          {sprints.flatMap(sp => {
                            const dates = datesBySprintId[sp.id] ?? [];
                            return dates.map((date, idx) => {
                              const inEpic = isDateInEpic(date, epic);
                              const first  = idx === 0 || !isDateInEpic(dates[idx - 1], epic);
                              const last   = idx === dates.length - 1 || !isDateInEpic(dates[idx + 1], epic);

                              const radius =
                                  first && last ? 'rounded-md'
                                      : first      ? 'rounded-l-md'
                                          : last       ? 'rounded-r-md'
                                              : '';

                              return (
                                  <TableCell
                                      key={`${epic.id}-${date.toISOString()}`}
                                      className={`p-0 border-r border-gray-100 ${isSprintStart(date) ? 'border-l border-gray-200' : ''}`}
                                  >
                                    {inEpic &&
                                        <div className={`gantt-bar h-4 ${colorOf(epic.status)} ${radius}`} />}
                                  </TableCell>
                              );
                            });
                          })}
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
  );
}

/* simple enum map to satisfy TS when mapping colours */
const EpicStatusMap = {
  NOT_STARTED: '',
  BACKLOG_REFINEMENT: '',
  READY_FOR_DEV: '',
  IMPLEMENTING: '',
  SIT: '',
  LAST_MILE: '',
  DONE: '',
  CANCELLED: '',
};
