package com.thesis.projectmanagement.dto.cost;

import lombok.Data;

@Data
public class CostResponse {
    private Long id;
    private String name;
    private Double amount;
    private String epicTitle;
    private String workItemTitle;
}