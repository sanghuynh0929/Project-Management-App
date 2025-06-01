// src/hooks/useResourceAllocations.ts
import { useQuery } from '@tanstack/react-query';
import {resourceAllocationService} from "@/services/resourceAllocationService";

export function useResourceAllocations(epicId?: number) {
    return useQuery({
        queryKey: ['allocations', epicId],
        enabled : !!epicId,
        queryFn : () => resourceAllocationService.getRaByEpic(epicId!),
    });
}
