package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.cost.CostDto;
import com.thesis.projectmanagement.dto.cost.CostRequest;
import java.util.List;

public interface CostService {
    List<CostDto> getCostsByEpicId(Long epicId);
    List<CostDto> getCostsByProjectId(Long projectId);
    CostDto createCost(CostRequest request);
    void deleteCost(Long id);
}