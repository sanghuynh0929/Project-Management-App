package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.project.ProjectRequest;
import com.thesis.projectmanagement.dto.project.ProjectResponse;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllProjects();
    ProjectResponse getProjectById(Long id);
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse updateProject(Long id, ProjectRequest request);
    void deleteProject(Long id);
}