package com.thesis.projectmanagement.dto.person;

import lombok.Data;

@Data
public class PersonResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
}