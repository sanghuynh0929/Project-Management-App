package com.thesis.projectmanagement.dto.cost;

import lombok.Data;

@Data
public class CostResponse {
    private Long id;
    private String name;
    private Double amount;
    private String description;
    private String type;
    private Long epicId;
    private String epicTitle;
    private Long workItemId;
    private String workItemTitle;
}