import axios from 'axios';

export interface Project {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export const getAllProjects = async (): Promise<Project[]> => {
    const response = await axios.get<Project[]>('http://localhost:8080/api/projects');
    return response.data;
};
