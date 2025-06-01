package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.constants.enums.EpicStatus;
import com.thesis.projectmanagement.dto.epic.EpicResponse;
import com.thesis.projectmanagement.dto.epic.EpicRequest;
import com.thesis.projectmanagement.mapper.EpicMapper;
import com.thesis.projectmanagement.model.Epic;
import com.thesis.projectmanagement.model.Project;
import com.thesis.projectmanagement.repository.EpicRepository;
import com.thesis.projectmanagement.repository.ProjectRepository;
import com.thesis.projectmanagement.service.EpicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EpicServiceImpl implements EpicService {

    private final EpicRepository epicRepository;
    private final ProjectRepository projectRepository;

    @Override
    public List<EpicResponse> getAllEpics() {
        return epicRepository.findAll()
                .stream()
                .map(EpicMapper::toDto)
                .toList();
    }
    @Override
    public List<EpicResponse> getEpicsByProjectId(Long projectId) {
        return epicRepository.findByProjectId(projectId)
                .stream()
                .map(EpicMapper::toDto)
                .toList();
    }

    @Override
    public EpicResponse getEpicById(Long id) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        return EpicMapper.toDto(epic);
    }

    @Override
    public EpicResponse createEpic(EpicRequest request) {

        Project project = projectRepository
                .findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Epic epic = EpicMapper.fromRequest(request, project);
        return EpicMapper.toDto(epicRepository.save(epic));
    }

    @Override
    public EpicResponse updateEpic(Long id, EpicRequest request) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));

        epic.setTitle(request.getTitle());
        epic.setDescription(request.getDescription());
        epic.setStartDate(request.getStartDate());
        epic.setEndDate(request.getEndDate());
        epic.setStatus(request.getStatus());

        return EpicMapper.toDto(epicRepository.save(epic));
    }

    @Override
    public void cancelEpic(Long id) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        epic.setStatus(EpicStatus.valueOf("CANCELED"));
        epicRepository.save(epic);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getDependencyTitles(Long epicId) {
        Epic epic = epicRepository.findWithDependenciesById(epicId);
        if (epic == null) {
            throw new IllegalArgumentException("Epic id=" + epicId + " không tồn tại");
        }
        return epic.getDependencies()
                .stream()
                .map(Epic::getTitle)
                .toList();
    }
}
