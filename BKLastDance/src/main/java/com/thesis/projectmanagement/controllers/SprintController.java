package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.SprintRequest;
import com.thesis.projectmanagement.dto.SprintResponse;
import com.thesis.projectmanagement.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SprintController {

    private final SprintService sprintService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SprintResponse>> getSprintsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(sprintService.getSprintsByProjectId(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SprintResponse> getSprintById(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.getSprintById(id));
    }

    @PostMapping
    public ResponseEntity<SprintResponse> createSprint(@RequestBody SprintRequest request) {
        return ResponseEntity.ok(sprintService.createSprint(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SprintResponse> updateSprint(@PathVariable Long id, @RequestBody SprintRequest request) {
        return ResponseEntity.ok(sprintService.updateSprint(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }
}