
import { api } from "./api";
import { Sprint } from "@/types";

export const sprintService = {
  getSprintsByProject: async (projectId: number): Promise<Sprint[]> => {
    const response = await api.get(`/api/sprints/project/${projectId}`);
    return response.data;
  },
  
  getSprintById: async (id: string): Promise<Sprint> => {
    const response = await api.get(`/api/sprints/${id}`);
    return response.data;
  },
  
  createSprint: async (sprint: Omit<Sprint, "id">): Promise<Sprint> => {
    const response = await api.post("/api/sprints", sprint);
    return response.data;
  },
  
  updateSprint: async (id: string, sprint: Partial<Sprint>): Promise<Sprint> => {
    const response = await api.put(`/api/sprints/${id}`, sprint);
    return response.data;
  },
  
  deleteSprint: async (id: string): Promise<void> => {
    await api.delete(`/api/sprints/${id}`);
  }
};
