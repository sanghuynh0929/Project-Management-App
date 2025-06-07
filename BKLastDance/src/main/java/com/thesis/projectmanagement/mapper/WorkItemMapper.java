package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.workItem.WorkItemRequest;
import com.thesis.projectmanagement.dto.workItem.WorkItemResponse;
import com.thesis.projectmanagement.model.WorkItem;

public class WorkItemMapper {

    public static WorkItem fromRequest(WorkItemRequest req) {
        WorkItem item = new WorkItem();
        item.setTitle(req.getTitle());
        item.setDescription(req.getDescription());
        item.setStartDate(req.getStartDate());
        item.setEndDate(req.getEndDate());
        item.setType(req.getType());
        return item;
    }

    public static WorkItemResponse toResponse(WorkItem item) {
        WorkItemResponse dto = new WorkItemResponse();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setStartDate(item.getStartDate());
        dto.setEndDate(item.getEndDate());
        dto.setType(item.getType());
        dto.setEpicId(item.getEpic() != null ? item.getEpic().getId() : null);
        dto.setSprintId(item.getSprint() != null ? item.getSprint().getId() : null);
        return dto;
    }
}
