// src/services/resourceService.ts
import {ResourceAllocation} from '@/types';
import {api} from "./api";

export const resourceAllocationService = {
    getRaByEpic: async (epicId: number): Promise<ResourceAllocation[]> => {
        const response = await api.get(`/api/ra/epic/${epicId}`);
        return response.data;
    },
};
