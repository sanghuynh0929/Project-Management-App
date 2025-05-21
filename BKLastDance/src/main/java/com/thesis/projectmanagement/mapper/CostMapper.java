package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.cost.CostRequest;
import com.thesis.projectmanagement.dto.cost.CostResponse;
import com.thesis.projectmanagement.model.Cost;

public class CostMapper {
    public static Cost fromRequest(CostRequest request) {
        Cost cost = new Cost();
        cost.setName(request.getName());
        cost.setAmount(request.getAmount());
        return cost;
    }

    public static CostResponse toResponse(Cost cost) {
        CostResponse dto = new CostResponse();
        dto.setId(cost.getId());
        dto.setName(cost.getName());
        dto.setAmount(cost.getAmount());
        dto.setEpicTitle(cost.getEpic() != null ? cost.getEpic().getTitle() : null);
        dto.setWorkItemTitle(cost.getWorkItem() != null ? cost.getWorkItem().getTitle() : null);
        return dto;
    }
}
