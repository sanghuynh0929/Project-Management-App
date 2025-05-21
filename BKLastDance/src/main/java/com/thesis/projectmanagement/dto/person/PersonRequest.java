package com.thesis.projectmanagement.dto.person;

import lombok.Data;

@Data
public class PersonRequest {
    private String name;
    private String email;
    private String role;
}