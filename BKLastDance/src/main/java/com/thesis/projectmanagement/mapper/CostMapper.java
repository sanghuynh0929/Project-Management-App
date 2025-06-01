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
        dto.setDescription(cost.getDescription());
        dto.setType(cost.getType());
        dto.setEpicId(cost.getEpic() != null ? cost.getEpic().getId() : null);
        dto.setEpicTitle(cost.getEpic() != null ? cost.getEpic().getTitle() : null);
        dto.setWorkItemId(cost.getWorkItem() != null ? cost.getWorkItem().getId() : null);
        dto.setWorkItemTitle(cost.getWorkItem() != null ? cost.getWorkItem().getTitle() : null);
        return dto;
    }
}
