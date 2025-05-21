package com.thesis.projectmanagement.dto.epic;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EpicResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String projectName; // extracted from project relationship
    private String status;

    private List<String> assigneeNames; // simplified: just names
    private List<Long> dependencyIds;   // simplified: just IDs
}
