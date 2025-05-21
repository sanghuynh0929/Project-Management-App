package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.SprintRequest;
import com.thesis.projectmanagement.dto.SprintResponse;

import java.util.List;

public interface SprintService {
    List<SprintResponse> getSprintsByProjectId(Long projectId);
    SprintResponse getSprintById(Long id);
    SprintResponse createSprint(SprintRequest request);
    SprintResponse updateSprint(Long id, SprintRequest request);
    void deleteSprint(Long id);
}