package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.dto.cost.CostResponse;
import com.thesis.projectmanagement.dto.cost.CostRequest;
import com.thesis.projectmanagement.mapper.CostMapper;
import com.thesis.projectmanagement.model.Cost;
import com.thesis.projectmanagement.model.Epic;
import com.thesis.projectmanagement.model.WorkItem;
import com.thesis.projectmanagement.repository.CostRepository;
import com.thesis.projectmanagement.repository.EpicRepository;
import com.thesis.projectmanagement.repository.WorkItemRepository;
import com.thesis.projectmanagement.service.CostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CostServiceImpl implements CostService {

    private final CostRepository costRepository;
    private final EpicRepository epicRepository;
    private final WorkItemRepository workItemRepository;

    @Override
    public List<CostResponse> getCostsByEpicId(Long epicId) {
        return costRepository.findByEpicId(epicId)
                .stream().map(CostMapper::toResponse).toList();
    }

    @Override
    public CostResponse createCost(CostRequest request) {
        Epic epic = epicRepository.findById(request.getEpicId()).orElse(null);
        WorkItem workItem = workItemRepository.findById(request.getWorkItemId()).orElse(null);
        Cost cost = CostMapper.fromRequest(request);
        cost.setEpic(epic);
        cost.setWorkItem(workItem);
        return CostMapper.toResponse(costRepository.save(cost));
    }

    @Override
    public void deleteCost(Long id) {
        costRepository.deleteById(id);
    }
}
