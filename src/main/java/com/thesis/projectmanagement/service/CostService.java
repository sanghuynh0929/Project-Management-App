package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.cost.CostRequest;
import com.thesis.projectmanagement.dto.cost.CostResponse;

import java.util.List;

public interface CostService {
    List<CostResponse> getCostsByEpicId(Long epicId);
    CostResponse createCost(CostRequest request);
    void deleteCost(Long id);
}