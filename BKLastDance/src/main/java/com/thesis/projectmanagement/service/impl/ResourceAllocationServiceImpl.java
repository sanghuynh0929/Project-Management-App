package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.dto.ResourceAllocationDto;
import com.thesis.projectmanagement.mapper.ResourceAllocationMapper;
import com.thesis.projectmanagement.repository.ResourceAllocationRepository;
import com.thesis.projectmanagement.service.ResourceAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceAllocationServiceImpl implements ResourceAllocationService {
    private final ResourceAllocationRepository repo;
    @Override
    public List<ResourceAllocationDto> getByEpic(Long epicId) {
        return repo.findByEpicId(epicId)
                .stream()
                .map(ResourceAllocationMapper::toDto)
                .toList();
    }
}
