package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.epic.EpicResponse;
import com.thesis.projectmanagement.dto.epic.EpicRequest;
import com.thesis.projectmanagement.model.Epic;
import com.thesis.projectmanagement.model.Person;

import java.util.stream.Collectors;

public class EpicMapper {
    public static EpicResponse toDto(Epic epic) {
        EpicResponse dto = new EpicResponse();
        dto.setId(epic.getId());
        dto.setTitle(epic.getTitle());
        dto.setDescription(epic.getDescription());
        dto.setStartDate(epic.getStartDate());
        dto.setEndDate(epic.getEndDate());
        dto.setStatus(epic.getStatus().name());

        if (epic.getProject() != null) {
            dto.setProjectName(epic.getProject().getName()); // Assuming Project has `getName()`
        }

        dto.setAssigneeNames(epic.getAssignees()
                .stream()
                .map(Person::getName) // or getName(), getEmail(), etc.
                .collect(Collectors.toList()));

        dto.setDependencyIds(epic.getDependencies()
                .stream()
                .map(Epic::getId)
                .collect(Collectors.toList()));

        return dto;
    }
    public static Epic fromRequest(EpicRequest request) {
        Epic epic = new Epic();
        epic.setTitle(request.getTitle());
        epic.setDescription(request.getDescription());
        epic.setStartDate(request.getStartDate());
        epic.setEndDate(request.getEndDate());
        epic.setStatus(request.getStatus());
        return epic;
    }
}
