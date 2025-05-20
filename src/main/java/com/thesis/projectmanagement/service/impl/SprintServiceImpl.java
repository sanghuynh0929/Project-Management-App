package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.dto.SprintRequest;
import com.thesis.projectmanagement.dto.SprintResponse;
import com.thesis.projectmanagement.mapper.SprintMapper;
import com.thesis.projectmanagement.model.Project;
import com.thesis.projectmanagement.model.Sprint;
import com.thesis.projectmanagement.repository.ProjectRepository;
import com.thesis.projectmanagement.repository.SprintRepository;
import com.thesis.projectmanagement.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    @Override
    public List<SprintResponse> getSprintsByProjectId(Long projectId) {
        return sprintRepository.findByProjectId(projectId)
                .stream()
                .map(SprintMapper::toResponse)
                .toList();
    }

    @Override
    public SprintResponse getSprintById(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        return SprintMapper.toResponse(sprint);
    }

    @Override
    public SprintResponse createSprint(SprintRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Sprint sprint = SprintMapper.fromRequest(request);
        sprint.setProject(project);
        return SprintMapper.toResponse(sprintRepository.save(sprint));
    }

    @Override
    public SprintResponse updateSprint(Long id, SprintRequest request) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        sprint.setName(request.getName());
        sprint.setStartDate(request.getStartDate());
        sprint.setEndDate(request.getEndDate());

        return SprintMapper.toResponse(sprintRepository.save(sprint));
    }

    @Override
    public void deleteSprint(Long id) {
        sprintRepository.deleteById(id);
    }
}