import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import EpicCard from './EpicCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEpics } from '@/hooks/useEpics';
import { Skeleton } from '@/components/ui/skeleton';

export function BacklogView() {
  /* 🔑 projectId lấy từ URL /epics/:projectId */
  const { projectId } = useParams<{ projectId: string }>();
  const pid = projectId ? Number(projectId) : undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  /* ✅ chỉ fetch khi pid tồn tại */
  const { epics = [], isLoading, isError } = useEpics(pid);

  /* ----- FILTER ----- */
  const filteredEpics = epics.filter((epic) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
        epic.title.toLowerCase().includes(search) ||
        epic.code.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'all' || epic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ----- RENDER ----- */
  if (isError) {
    return (
        <div className="py-12 text-center">
          <p className="text-xl text-muted-foreground">
            Failed to load epics. Please try again later.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* search + filter */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search epics..."
                className="pl-8"
                disabled={isLoading}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'all',
                  'Not started',
                  'Backlog refinement',
                  'READY_FOR_DEV',
                  'IMPLEMENTING',
                  'SIT',
                  'Last mile',
                  'DONE',
                  'CANCELLED',
                ].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v === 'all' ? 'All Statuses' : v}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* content */}
        {isLoading ? (
            /* skeletons */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="mb-4 h-4 w-1/4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
              ))}
            </div>
        ) : filteredEpics.length === 0 ? (
            /* empty state */
            <div className="py-12 text-center">
              <p className="text-xl text-muted-foreground">
                No epics found matching your criteria
              </p>
              <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
              >
                Clear Filters
              </Button>
            </div>
        ) : (
            /* epic list */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEpics.map((epic) => (
                  <EpicCard key={epic.id} epic={epic} />
              ))}
            </div>
        )}
      </div>
  );
}
