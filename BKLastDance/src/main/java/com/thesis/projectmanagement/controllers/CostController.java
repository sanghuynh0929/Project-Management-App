package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.cost.CostDto;
import com.thesis.projectmanagement.dto.cost.CostRequest;
import com.thesis.projectmanagement.service.CostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/costs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CostController {

    private final CostService costService;

    @GetMapping("/epic/{epicId}")
    public ResponseEntity<List<CostDto>> getCostsByEpic(@PathVariable Long epicId) {
        return ResponseEntity.ok(costService.getCostsByEpicId(epicId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CostDto>> getCostsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(costService.getCostsByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<CostDto> createCost(@RequestBody CostRequest request) {
        return ResponseEntity.ok(costService.createCost(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCost(@PathVariable Long id) {
        costService.deleteCost(id);
        return ResponseEntity.noContent().build();
    }
}