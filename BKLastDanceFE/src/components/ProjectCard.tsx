/* no JSX import needed with `"jsx":"react-jsx"` */
export interface ProjectCardProps {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    onClick?: (id: number) => void;
}

export default function ProjectCard({
                                        id, name, description, createdAt, updatedAt, onClick,
                                    }: ProjectCardProps) {
    return (
        <div
            className="cursor-pointer rounded-2xl border border-green-200 bg-white p-6 shadow-md transition hover:shadow-lg"
            onClick={() => onClick?.(id)}
        >
            <h2 className="mb-2 text-xl font-semibold text-green-800">{name}</h2>
            <p className="mb-4 text-sm text-gray-600">{description}</p>
            <div className="text-sm text-gray-500">
                Created&nbsp;{new Date(createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">
                Updated&nbsp;{new Date(updatedAt).toLocaleDateString()}
            </div>
        </div>
    );
}
