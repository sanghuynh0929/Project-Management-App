package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.dto.workItem.WorkItemRequest;
import com.thesis.projectmanagement.dto.workItem.WorkItemResponse;
import com.thesis.projectmanagement.mapper.WorkItemMapper;
import com.thesis.projectmanagement.model.Epic;
import com.thesis.projectmanagement.model.Sprint;
import com.thesis.projectmanagement.model.WorkItem;
import com.thesis.projectmanagement.repository.EpicRepository;
import com.thesis.projectmanagement.repository.SprintRepository;
import com.thesis.projectmanagement.repository.WorkItemRepository;
import com.thesis.projectmanagement.service.WorkItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkItemServiceImpl implements WorkItemService {

    private final WorkItemRepository workItemRepository;
    private final EpicRepository epicRepository;
    private final SprintRepository sprintRepository;

    @Override
    public List<WorkItemResponse> getWorkItemsByEpicId(Long epicId) {
        return workItemRepository.findByEpicId(epicId)
                .stream()
                .map(WorkItemMapper::toResponse)
                .toList();
    }
    @Override
    public List<WorkItemResponse> getWorkItemsByProjectId(Long projectId) {
        return workItemRepository.findByEpicProjectId(projectId)
                .stream()
                .map(WorkItemMapper::toResponse)
                .toList();
    }

    @Override
    public WorkItemResponse getWorkItemById(Long id) {
        WorkItem workItem = workItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WorkItem not found"));
        return WorkItemMapper.toResponse(workItem);
    }

    @Override
    public WorkItemResponse createWorkItem(WorkItemRequest request) {
        Epic epic = epicRepository.findById(request.getEpicId())
                .orElseThrow(() -> new RuntimeException("Epic not found"));

        Sprint sprint = sprintRepository.findById(request.getSprintId()).orElse(null);

        WorkItem workItem = WorkItemMapper.fromRequest(request);
        workItem.setEpic(epic);
        workItem.setSprint(sprint);
        return WorkItemMapper.toResponse(workItemRepository.save(workItem));
    }

    @Override
    public WorkItemResponse updateWorkItem(Long id, WorkItemRequest request) {
        WorkItem workItem = workItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WorkItem not found"));

        workItem.setTitle(request.getTitle());
        workItem.setDescription(request.getDescription());
        workItem.setStartDate(request.getStartDate());
        workItem.setEndDate(request.getEndDate());
        workItem.setType(request.getType());

        Sprint sprint = sprintRepository.findById(request.getSprintId()).orElse(null);
        workItem.setSprint(sprint);

        return WorkItemMapper.toResponse(workItemRepository.save(workItem));
    }

    @Override
    public void deleteWorkItem(Long id) {
        workItemRepository.deleteById(id);
    }
}