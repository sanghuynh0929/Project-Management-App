package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.workItem.WorkItemRequest;
import com.thesis.projectmanagement.dto.workItem.WorkItemResponse;

import java.util.List;

public interface WorkItemService {
    List<WorkItemResponse> getWorkItemsByEpicId(Long epicId);
    WorkItemResponse getWorkItemById(Long id);
    WorkItemResponse createWorkItem(WorkItemRequest request);
    WorkItemResponse updateWorkItem(Long id, WorkItemRequest request);
    void deleteWorkItem(Long id);
}