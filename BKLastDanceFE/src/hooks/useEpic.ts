import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";


import type {
  Epic,
  WorkItem,
  Sprint,
  ResourceAllocation,
  Cost,
  Person,
} from "@/types";
import {epicService} from "@/services/epicService.ts";
import {workItemService} from "@/services/workItemService.ts";
import {resourceAllocationService} from "@/services/resourceAllocationService.ts";
import {costService} from "@/services/costService.ts";
import {sprintService} from "@/services/sprintService.ts";
import {personService} from "@/services/personService.ts";

export function useEpic(epicId?: number) {
  /* ───────────── Epic ───────────── */
  const epicQuery = useQuery<Epic>({
    queryKey : ["epic", epicId],
    queryFn  : () => epicService.getEpicById(epicId!),
    enabled  : !!epicId,
  });

  /* ───────────── Các bảng phụ thuộc Epic ───────────── */
  const workItemsQuery = useQuery<WorkItem[]>({
    queryKey : ["workItems", epicId],
    queryFn  : () => workItemService.getWorkItemsByEpic(epicId!),
    enabled  : !!epicId,
  });

  const allocationsQuery = useQuery<ResourceAllocation[]>({
    queryKey : ["allocations", epicId],
    queryFn  : () => resourceAllocationService.getRaByEpic(epicId!),
    enabled  : !!epicId,
  });

  const costsQuery = useQuery<Cost[]>({
    queryKey : ["costs", epicId],
    queryFn  : () => costService.getCostsByEpic(epicId!),
    enabled  : !!epicId,
  });

  /* ───────────── Sprints (cần projectId) ───────────── */
  const sprintsQuery = useQuery<Sprint[]>({
    queryKey : ["sprints", epicQuery.data?.projectId],
    queryFn  : () => sprintService.getSprintsByProject(epicQuery.data!.projectId),
    enabled  : !!epicQuery.data?.projectId,
  });

  /* ───────────── Persons (dùng tra cứu) ───────────── */
  const personsQuery = useQuery<Person[]>({
    queryKey : ["persons"],
    queryFn  : personService.getAllPersons,
    staleTime: 5 * 60_000,
  });

  /* ───────────── Helper Map ───────────── */
  const personMap = useMemo<Record<number, Person>>(
      () => Object.fromEntries(
          (Array.isArray(personsQuery.data) ? personsQuery.data : []).map(p => [p.id, p]),
      ),
      [personsQuery.data],
  );

  const sprintMap = useMemo<Record<number, Sprint>>(
      () => Object.fromEntries((Array.isArray(sprintsQuery.data)? sprintsQuery.data:[]).map(s => [s.id, s])),
      [sprintsQuery.data],
  );

  /* ───────────── Tổng hợp state ───────────── */
  const isLoading =
      epicQuery.isLoading ||
      workItemsQuery.isLoading ||
      allocationsQuery.isLoading ||
      costsQuery.isLoading ||
      sprintsQuery.isLoading ||
      personsQuery.isLoading;

  const error =
      epicQuery.error ||
      workItemsQuery.error ||
      allocationsQuery.error ||
      costsQuery.error ||
      sprintsQuery.error ||
      personsQuery.error;

  const toArray = <T>(arr: T[] | undefined): T[] => (arr ?? []) as T[];

  return {
    /* data */
    epic        : toArray(epicQuery.data) as Epic,
    workItems   : toArray(workItemsQuery.data) as WorkItem[],
    allocations : toArray(allocationsQuery.data) as ResourceAllocation[],
    costs       : toArray(costsQuery.data) as Cost[],
    sprints     : toArray(sprintsQuery.data) as Sprint[],

    /* maps */
    personMap,
    sprintMap,

    /* state */
    isLoading,
    isError : !!error,
    error,
  };
}
