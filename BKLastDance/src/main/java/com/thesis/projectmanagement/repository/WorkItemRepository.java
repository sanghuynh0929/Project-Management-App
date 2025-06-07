package com.thesis.projectmanagement.repository;

import com.thesis.projectmanagement.model.WorkItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkItemRepository extends JpaRepository<WorkItem, Long> {
    List<WorkItem> findByEpicId(Long epicId);
    List<WorkItem> findByEpicProjectId(Long projectId);
}

