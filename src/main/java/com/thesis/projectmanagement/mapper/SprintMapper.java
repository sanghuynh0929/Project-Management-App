package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.SprintRequest;
import com.thesis.projectmanagement.dto.SprintResponse;
import com.thesis.projectmanagement.model.Sprint;

public class SprintMapper {

    public static Sprint fromRequest(SprintRequest req) {
        Sprint sprint = new Sprint();
        sprint.setName(req.getName());
        sprint.setStartDate(req.getStartDate());
        sprint.setEndDate(req.getEndDate());
        return sprint;
    }

    public static SprintResponse toResponse(Sprint sprint) {
        SprintResponse dto = new SprintResponse();
        dto.setId(sprint.getId());
        dto.setName(sprint.getName());
        dto.setStartDate(sprint.getStartDate());
        dto.setEndDate(sprint.getEndDate());
        dto.setProjectName(sprint.getProject() != null ? sprint.getProject().getName() : null);
        return dto;
    }
}
