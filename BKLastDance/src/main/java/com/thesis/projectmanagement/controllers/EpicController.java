package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.epic.EpicResponse;
import com.thesis.projectmanagement.dto.epic.EpicRequest;
import com.thesis.projectmanagement.service.EpicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/epics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend calls
public class EpicController {

    private final EpicService epicService;

    @GetMapping
    public ResponseEntity<List<EpicResponse>> getAllEpics() {
        return ResponseEntity.ok(epicService.getAllEpics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EpicResponse> getEpicById(@PathVariable Long id) {
        return ResponseEntity.ok(epicService.getEpicById(id));
    }

    @PostMapping
    public ResponseEntity<EpicResponse> createEpic(@RequestBody EpicRequest request) {
        return ResponseEntity.ok(epicService.createEpic(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EpicResponse> updateEpic(@PathVariable Long id, @RequestBody EpicRequest request) {
        return ResponseEntity.ok(epicService.updateEpic(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelEpic(@PathVariable Long id) {
        epicService.cancelEpic(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<EpicResponse>> getEpicsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(epicService.getEpicsByProjectId(projectId));
    }

    @GetMapping("/{id}/dependencies")
    public ResponseEntity<List<String>> getDependencies(@PathVariable Long id) {
        return ResponseEntity.ok(epicService.getDependencyTitles(id));
    }
}
