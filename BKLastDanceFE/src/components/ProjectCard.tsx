import React from 'react';

interface ProjectCardProps {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    onClick?: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, name, description, createdAt, updatedAt, onClick }) => {
    return (
        <div
            className="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 border border-green-200 cursor-pointer transition duration-300"
            onClick={() => onClick?.(id)}
        >
            <h2 className="text-xl font-semibold text-green-800 mb-2">{name}</h2>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
            <div className="text-sm text-gray-500">Created: {new Date(createdAt).toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">Updated: {new Date(updatedAt).toLocaleDateString()}</div>
        </div>
    );
};

export default ProjectCard;
