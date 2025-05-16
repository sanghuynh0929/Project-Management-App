package com.thesis.projectmanagement;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectManagementController {
    @RequestMapping
    public String index() {
        return "Hello World";
    }
}
