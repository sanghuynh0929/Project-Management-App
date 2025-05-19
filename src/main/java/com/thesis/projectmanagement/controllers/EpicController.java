package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.EpicDto;
import com.thesis.projectmanagement.dto.EpicRequest;
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
    public ResponseEntity<List<EpicDto>> getAllEpics() {
        return ResponseEntity.ok(epicService.getAllEpics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EpicDto> getEpicById(@PathVariable Long id) {
        return ResponseEntity.ok(epicService.getEpicById(id));
    }

    @PostMapping
    public ResponseEntity<EpicDto> createEpic(@RequestBody EpicRequest request) {
        return ResponseEntity.ok(epicService.createEpic(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EpicDto> updateEpic(@PathVariable Long id, @RequestBody EpicRequest request) {
        return ResponseEntity.ok(epicService.updateEpic(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelEpic(@PathVariable Long id) {
        epicService.cancelEpic(id);
        return ResponseEntity.noContent().build();
    }
}
