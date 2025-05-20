package com.thesis.projectmanagement.dto.epic;

import com.thesis.projectmanagement.constants.enums.EpicStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EpicRequest {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private EpicStatus status; // or use EpicStatus enum
}

