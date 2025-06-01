
import { api } from "./api";
import {Epic, Sprint} from "@/types";

export const epicService = {
  getAllEpics: async (): Promise<Epic[]> => {
    const response = await api.get("/api/epics");
    return response.data;
  },
  getEpicsByProject: async (projectId: number): Promise<Epic[]> => {
    const response = await api.get(`/api/epics/project/${projectId}`);
    return response.data;
  },
  getEpicById: async (id: number): Promise<Epic> => {
    const response = await api.get(`/api/epics/${id}`);
    return response.data;
  },
  
  createEpic: async (epic: Omit<Epic, "id">): Promise<Epic> => {
    const response = await api.post("/api/epics", epic);
    return response.data;
  },
  
  updateEpic: async (id: string, epic: Partial<Epic>): Promise<Epic> => {
    const response = await api.put(`/api/epics/${id}`, epic);
    return response.data;
  },
  
  deleteEpic: async (id: string): Promise<void> => {
    await api.delete(`/api/epics/${id}`);
  },
  
  getEpicDependencies: async (epicId: number): Promise<string[]> => {
    const response = await api.get(`/api/epics/${epicId}/dependencies`);
    return response.data;
  },

  
  getEpicEffort: async (epicId: string): Promise<any> => {
    const response = await api.get(`/api/epics/${epicId}/effort`);
    return response.data;
  }
};
