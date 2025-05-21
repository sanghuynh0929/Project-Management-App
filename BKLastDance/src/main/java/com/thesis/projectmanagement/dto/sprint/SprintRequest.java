package com.thesis.projectmanagement.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SprintRequest {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long projectId;
}