package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.ResourceAllocationDto;
import com.thesis.projectmanagement.model.ResourceAllocation;

public class ResourceAllocationMapper {
    public static ResourceAllocationDto toDto(ResourceAllocation ra) {
        ResourceAllocationDto dto = new ResourceAllocationDto();
        dto.setId(ra.getId());
        dto.setEpicId(ra.getEpic().getId());
        dto.setEpicTitle(ra.getEpic().getTitle());
        dto.setPersonId(ra.getPerson().getId());
        dto.setPersonName(ra.getPerson().getName());
        dto.setPersonRole(ra.getPerson().getRole());
        dto.setSprintId(ra.getSprint().getId());
        dto.setSprintName(ra.getSprint().getName());
        dto.setFte(ra.getFte());
        return dto;
    }
}
