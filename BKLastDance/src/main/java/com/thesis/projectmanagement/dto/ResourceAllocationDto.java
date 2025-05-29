package com.thesis.projectmanagement.dto;

import lombok.Data;

@Data
public class ResourceAllocationDto {
    private Long id;
    private Long epicId;
    private String epicTitle;
    private Long personId;
    private String personName;
    private String personRole;
    private Long sprintId;
    private String sprintName;
    private Double fte;
}

