package com.thesis.projectmanagement.dto.cost;

import lombok.Data;

@Data
public class CostRequest {
    private String name;
    private Double amount;
    private Long epicId;
    private Long workItemId;
}