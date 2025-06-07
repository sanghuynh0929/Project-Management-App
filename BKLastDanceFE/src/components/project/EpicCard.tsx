import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Epic, EpicStatus } from '@/types';
import { formatDate } from '@/utils/date.ts';

interface EpicCardProps {
  epic: Epic; // Data from API (id, title, description, startDate, endDate, status, projectId)
}

// Map each status to a badge colour class
const statusColor: Record<EpicStatus, string> = {
  'Not started': 'bg-gray-200 text-gray-800',
  'Backlog refinement': 'bg-orange-200 text-orange-800',
  'Ready for dev': 'bg-blue-200 text-blue-800',
  Implementing: 'bg-sky-200 text-sky-800',
  SIT: 'bg-purple-200 text-purple-800',
  'Last mile': 'bg-amber-200 text-amber-800',
  Done: 'bg-green-200 text-green-800',
  Cancelled: 'bg-red-200 text-red-800',
};

export default function EpicCard({ epic }: EpicCardProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const linkTo = projectId
      ? `/projects/${projectId}/epics/${epic.id}`
      : `/epics/${epic.id}`;

  return (
      <Link to={linkTo} className="block w-full h-full">
        <Card className="epic-card w-full h-full transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg leading-tight line-clamp-2">
              {epic.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Timeline:</span>
                <span className="ml-2 font-medium">
                {formatDate(epic.startDate)} – {formatDate(epic.targetEndDate)}
              </span>
              </div>

              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge className={`ml-2 ${statusColor[epic.status]}`}>{epic.status}</Badge>
              </div>

              {epic.description && (
                  <p className="line-clamp-2 text-muted-foreground">{epic.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
  );
}
