// src/hooks/useProject.ts
import { useParams } from 'react-router-dom';
import {
  useQuery,
  useQueries,
  useQueryClient,
  useMutation,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { epicService }        from '@/services/epicService';
import { workItemService }    from '@/services/workItemService';
import { sprintService }      from '@/services/sprintService';

import { Epic, EpicRequest, Sprint, WorkItem } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useProject(overrideProjectId?: number) {
  /* 1️⃣  Xác định projectId */
  const { projectId: routeId } = useParams<{ projectId: string }>();
  const pid = overrideProjectId ?? (routeId ? Number(routeId) : undefined);

  const qc = useQueryClient();

  /* 2️⃣  Tải danh sách Epic */
  const epicsQuery = useQuery<Epic[]>({
    queryKey : ['epics', pid],
    queryFn  : () => epicService.getEpicsByProject(pid!), // pid chắc chắn tồn tại nhờ enabled
    enabled  : !!pid,
    staleTime: 5 * 60_000,
  });

  const epics = epicsQuery.data;

  /* 3️⃣  Tải WorkItems cho TỪNG Epic song song --------------- */
  type WIQuery = { queryKey: readonly unknown[]; queryFn: () => Promise<WorkItem[]>; enabled: boolean; staleTime: number };

  const wiQueriesConfig = useMemo(
      () =>
          epics.map<WIQuery>(epic => ({
            queryKey : ['workItems', epic.id],
            queryFn  : () => workItemService.getWorkItemsByEpic(epic.id),
            staleTime: 5 * 60_000,
            enabled  : !!epic.id,
          })) as const,               // tuple readonly cho React-Query v5
      [epics],
  );

  const wiQueries = useQueries({ queries: wiQueriesConfig });

  /* Map workItems theo EpicId để tra cứu O(1) */
  const workItemsByEpic: Record<number, WorkItem[]> = useMemo(() => {
    const map: Record<number, WorkItem[]> = {};
    wiQueries.forEach((q, idx) => {
      const epicId = epics[idx]?.id;
      if (epicId) map[epicId] = q.data ?? [];
    });
    return map;
  }, [wiQueries, epics]);

  /* 4️⃣  Tải Sprints của Project */
  const sprintsQuery = useQuery<Sprint[]>({
    queryKey : ['sprints', pid],
    queryFn  : () => sprintService.getSprintsByProject(pid!),
    enabled  : !!pid,
    staleTime: 5 * 60_000,
  });

  /* 5️⃣  CRUD Epic (sử dụng react-query mutation) ------------ */
  const invalidateEpics = () => qc.invalidateQueries({ queryKey: ['epics', pid] });

  const createEpic = useMutation({
    mutationFn : (data: Omit<EpicRequest, 'projectId'>) =>
        epicService.createEpic({ ...data, projectId: pid! }),
    onSuccess  : () => {
      invalidateEpics();
      toast({ title: 'Epic created', description: 'Created successfully.' });
    },
    onError    : () => toast({ title: 'Error', variant: 'destructive', description: 'Create failed.' }),
  });

  const updateEpic = useMutation({
    mutationFn : ({ id, data }: { id: string; data: Partial<Epic> }) =>
        epicService.updateEpic(id, data),
    onSuccess  : () => {
      invalidateEpics();
      toast({ title: 'Epic updated', description: 'Updated successfully.' });
    },
    onError    : () => toast({ title: 'Error', variant: 'destructive', description: 'Update failed.' }),
  });

  const deleteEpic = useMutation({
    mutationFn : (id: string) => epicService.deleteEpic(id),
    onSuccess  : () => {
      invalidateEpics();
      toast({ title: 'Epic cancelled', description: 'Status set to Cancelled.' });
    },
    onError    : () => toast({ title: 'Error', variant: 'destructive', description: 'Delete failed.' }),
  });

  /* 6️⃣  Tổng hợp trạng thái tải */
  const isLoading =
      epicsQuery.isLoading || wiQueries.some(q => q.isLoading) || sprintsQuery.isLoading;

  const isError =
      epicsQuery.isError || wiQueries.some(q => q.isError) || sprintsQuery.isError;

  const error =
      epicsQuery.error || wiQueries.find(q => q.error)?.error || sprintsQuery.error;

  /* 7️⃣  Xuất ra cho component */
  return {
    /* dữ liệu */
    epics,
    workItemsByEpic,
    sprints        : sprintsQuery.data ?? [],

    /* trạng thái */
    isLoading,
    isError,
    error,

    /* CRUD helpers */
    createEpic : createEpic.mutate,
    updateEpic : updateEpic.mutate,
    deleteEpic : deleteEpic.mutate,
  };
}
