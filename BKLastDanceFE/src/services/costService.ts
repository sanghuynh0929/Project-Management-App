
import { api } from "./api";
import { Cost } from "@/types";

export const costService = {
  getCostsByEpic: async (epicId: number): Promise<Cost[]> => {
    const response = await api.get(`/api/costs/epic/${epicId}`);
    return response.data;
  },
  
  createCost: async (cost: Omit<Cost, "id">): Promise<Cost> => {
    const response = await api.post("/api/costs", cost);
    return response.data;
  },
  
  updateCost: async (id: string, cost: Partial<Cost>): Promise<Cost> => {
    const response = await api.put(`/api/costs/${id}`, cost);
    return response.data;
  },
  
  deleteCost: async (id: string): Promise<void> => {
    await api.delete(`/api/costs/${id}`);
  }
};
