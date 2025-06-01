
import { api } from "./api";
import { UserStory, WorkItem } from "@/types";

export const workItemService = {

  getWorkItemsByEpic: async (epicId: number): Promise<WorkItem[]> => {
    const response = await api.get(`/api/workitems/epic/${epicId}`);
    return response.data;
  },

  getWorkItemById: async (id: string): Promise<WorkItem> => {
    const response = await api.get(`/api/workitems/${id}`);
    return response.data;
  },

  createWorkItem: async (workItem: Omit<WorkItem, "id">): Promise<WorkItem> => {
    const response = await api.post("/api/workitems", workItem);
    return response.data;
  },

  updateWorkItem: async (id: string, workItem: Partial<WorkItem>): Promise<WorkItem> => {
    const response = await api.put(`/api/workitems/${id}`, workItem);
    return response.data;
  },

  deleteWorkItem: async (id: string): Promise<void> => {
    await api.delete(`/api/workitems/${id}`);
  },

  getWorkItemDependencies: async (workItemId: string): Promise<string[]> => {
    const response = await api.get(`/api/workitems/${workItemId}/dependencies`);
    return response.data;

  },

  getWorkItemAssignees: async (workItemId: string): Promise<string[]> => {
    const response = await api.get(`/api/workitems/${workItemId}/assignees`);
    return response.data;
  }
};