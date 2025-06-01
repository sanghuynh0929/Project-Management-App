import React from "react";

import { useParams, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { EpicDetailHeader } from "@/components/epics/EpicDetailHeader";
import { EpicTabs } from "@/components/epics/EpicTabs";
import { UserStory, WorkItem } from "@/types";
import { useEpic } from "@/hooks/useEpic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Page: Epic Detail
 * - Lấy `epicId` từ URL (/:id)
 * - Dùng `useEpic` để tải toàn bộ dữ liệu liên quan
 * - Hiển thị header + tabs
 */
const EpicDetail = () => {
  /* ---------------- params ---------------- */
  const { id } = useParams<{ id: string }>();
  const epicId = Number(id); // bảo đảm number

  /* ---------------- data ---------------- */
  const { epic, isLoading, isError } = useEpic(epicId);

  /* ---------------- handlers ---------------- */
  const handleEditEpic = () => {
    console.log("Editing epic:", epic);
  };

  const handleEditWorkItem = (workItem: WorkItem) => {
    console.log("Editing work item:", workItem);
  };

  const handleAddWorkItem = () => {
    console.log("Adding new work item to epic:", epicId);
  };

  /* ---------------- state guard ---------------- */
  if (isError) return <Navigate to="/" />;

  if (isLoading) {
    return (
        <MainLayout title="Loading Epic…">
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </MainLayout>
    );
  }

  if (!epic) return <Navigate to="/" />;

  /* ---------------- render ---------------- */
  return (
      <MainLayout title={`Epic: ${epic.title}`}>
        <div className="space-y-6">
          <EpicDetailHeader epic={epic} onEdit={handleEditEpic} />

          <EpicTabs
              epicId={epicId}
              onEditWorkItem={handleEditWorkItem}
              onAddWorkItem={handleAddWorkItem}
          />
        </div>
      </MainLayout>
  );
};

export default EpicDetail;
