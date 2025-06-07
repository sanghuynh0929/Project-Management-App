import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { epicService } from '@/services/epicService';
import {Cost, Epic, EpicRequest, Sprint, WorkItem} from '@/types';
import { toast } from '@/hooks/use-toast';
import {workItemService} from "@/services/workItemService.ts";
import {sprintService} from "@/services/sprintService.ts";
import {costService} from "@/services/costService.ts";
import {useMemo} from "react";

/**
 * useEpics – fetch + CRUD epics theo project hiện tại
 *
 *                            nếu bỏ trống sẽ đọc từ URL /epics/:projectId
 * @param pid
 */
export function useProject(pid?: number) {

  const queryClient = useQueryClient();

  /* 2️⃣  Fetch danh sách epics theo project */
  const epicsQuery = useQuery({
    queryKey: ['epics', pid],
    enabled : !!pid,                              // chỉ chạy khi có id
    queryFn : () => epicService.getEpicsByProject(pid!),
  });

  const costsQuery   = useQuery({
      queryKey: ['costs',   pid],
      enabled: !!pid,
      queryFn: () => costService.getCostsByProject(pid!)
  });

  const sprintsQuery = useQuery({
    queryKey : ['sprints', pid],
    enabled  : !!pid,
    queryFn  : () => sprintService.getSprintsByProject(pid!),
  });

  const workItemsQuery = useQuery<WorkItem[]>({
    queryKey : ["workItems", pid],
    queryFn  : () => workItemService.getWorkItemsByProject(pid!),
    enabled  : !!pid,
  });

  /* 3️⃣  Helper invalidation */
  const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ['epics', pid] });

  /* 4️⃣  Create */
  const createEpic = useMutation({
    mutationFn: (data: Omit<EpicRequest, 'projectId'>) =>
        epicService.createEpic({ ...data, projectId: pid! }),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Epic Created', description: 'Created successfully.' });
    },
    onError: () =>
        toast({ title: 'Error', description: 'Create failed.', variant: 'destructive' }),
  });

  /* 5️⃣  Update */
  const updateEpic = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Epic> }) =>
        epicService.updateEpic(id, data),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Epic Updated', description: 'Updated successfully.' });
    },
    onError: () =>
        toast({ title: 'Error', description: 'Update failed.', variant: 'destructive' }),
  });

  /* 6️⃣  Delete */
  const deleteEpic = useMutation({
    mutationFn: (id: string) => epicService.deleteEpic(id),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Epic Deleted', description: 'Deleted successfully.' });
    },
    onError: () =>
        toast({ title: 'Error', description: 'Delete failed.', variant: 'destructive' }),
  });

  /* 7️⃣  Trả về tiện ích */
  return {
    epics      : epicsQuery.data ?? [],
    sprints : sprintsQuery.data ?? [],
    costs : costsQuery.data ?? [],
    workItems : workItemsQuery.data,
    isLoading  : epicsQuery.isLoading,
    isError    : epicsQuery.isError,
    error      : epicsQuery.error,
    createEpic : createEpic.mutate,
    updateEpic : updateEpic.mutate,
    deleteEpic : deleteEpic.mutate,
  };
}