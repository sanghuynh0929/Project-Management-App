package com.thesis.projectmanagement.dto.workItem;

import com.thesis.projectmanagement.model.WorkItem.WorkItemType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkItemResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private WorkItemType type;
    private String epicTitle;
    private String sprintName;
}
