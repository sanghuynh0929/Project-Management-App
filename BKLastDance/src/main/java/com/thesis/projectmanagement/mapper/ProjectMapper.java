package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.project.ProjectRequest;
import com.thesis.projectmanagement.dto.project.ProjectResponse;
import com.thesis.projectmanagement.model.Project;

import java.time.LocalDateTime;

public class ProjectMapper {

    public static Project fromRequest(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        return project;
    }

    public static ProjectResponse toResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
