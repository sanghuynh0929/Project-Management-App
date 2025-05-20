package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.dto.project.ProjectRequest;
import com.thesis.projectmanagement.dto.project.ProjectResponse;
import com.thesis.projectmanagement.mapper.ProjectMapper;
import com.thesis.projectmanagement.model.Project;
import com.thesis.projectmanagement.repository.ProjectRepository;
import com.thesis.projectmanagement.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return ProjectMapper.toResponse(project);
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        Project project = ProjectMapper.fromRequest(request);
        return ProjectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        return ProjectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}