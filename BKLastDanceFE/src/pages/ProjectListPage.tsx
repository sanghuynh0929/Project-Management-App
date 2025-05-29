import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, Project } from '../api/ProjectApi';
import ProjectCard from '../components/ProjectCard';

const ProjectListPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate(); // ✅ đây là hook điều hướng

    useEffect(() => {
        getAllProjects()
            .then(setProjects)
            .catch(() => setError('Failed to load projects'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center text-green-600 mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 px-8 py-10">
            <h1 className="text-3xl font-bold text-green-700 mb-8">Your Projects</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        createdAt={project.createdAt}
                        updatedAt={project.updatedAt}
                        onClick={() => navigate(`/projects/${project.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectListPage;
