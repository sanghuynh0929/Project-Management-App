import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService, Project } from "@/services/projectService";
import ProjectCard from "@/components/ProjectCard";

const ProjectListPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        projectService
            .getAllProjects()
            .then(setProjects)
            .catch(() => setError("Failed to load epics"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="mt-10 text-center text-green-600">Loading...</p>;
    if (error)   return <p className="mt-10 text-center text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 px-8 py-10">
            <h1 className="mb-8 text-3xl font-bold text-green-700">Projects</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {projects.map(p => (
                    <ProjectCard
                        key={p.id}
                        id={+p.id}
                        name={p.name}
                        description={p.description ?? ""}
                        createdAt={p.createdAt.toString()}
                        updatedAt={p.updatedAt.toString()}
                        onClick={id => navigate(`/projects/${id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectListPage;
