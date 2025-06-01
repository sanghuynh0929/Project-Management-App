
import { api } from "./api";
import {Person} from "@/types";

export const personService = {
  getAllPersons: async (): Promise<Person[]> => {
    const response = await api.get("/api/persons");
    return response.data;
  },
  
  getPersonById: async (id: number): Promise<Person> => {
    const response = await api.get(`/api/persons/${id}`);
    return response.data;
  },
  
  createPerson: async (person: Omit<Person, "id">): Promise<Person> => {
    const response = await api.post("/api/persons", person);
    return response.data;
  },
  
  updatePerson: async (id: string, person: Partial<Person>): Promise<Person> => {
    const response = await api.put(`/api/persons/${id}`, person);
    return response.data;
  },
  
  deletePerson: async (id: string): Promise<void> => {
    await api.delete(`/api/persons/${id}`);
  }
};
