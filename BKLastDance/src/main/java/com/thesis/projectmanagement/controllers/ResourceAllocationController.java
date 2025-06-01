package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.ResourceAllocationDto;
import com.thesis.projectmanagement.service.ResourceAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ra")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceAllocationController {
    private final ResourceAllocationService service;
    @GetMapping("/epic/{epicId}")
    public List<ResourceAllocationDto> getByEpic(@PathVariable Long epicId) {
        return service.getByEpic(epicId);
    }
}
