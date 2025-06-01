
import { api } from "./api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get("/api/projects");
    return response.data;
  },
  
  getProjectById: async (id: string): Promise<Project> => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },
  
  createProject: async (project: Omit<Project, "id">): Promise<Project> => {
    const response = await api.post("/api/projects", project);
    return response.data;
  },
  
  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await api.put(`/api/projects/${id}`, project);
    return response.data;
  },
  
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  }
};
