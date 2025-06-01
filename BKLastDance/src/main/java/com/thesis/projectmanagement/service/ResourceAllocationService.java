package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.ResourceAllocationDto;

import java.util.List;

public interface ResourceAllocationService {
    List<ResourceAllocationDto> getByEpic(Long epicId);
}
