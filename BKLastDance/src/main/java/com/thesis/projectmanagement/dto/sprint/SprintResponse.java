package com.thesis.projectmanagement.dto;

import lombok.Data;

import java.time.LocalDate;

@Data

public class SprintResponse {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String projectName;
}
