package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.cost.CostResponse;
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
    public ResponseEntity<List<CostResponse>> getCostsByEpic(@PathVariable Long epicId) {
        return ResponseEntity.ok(costService.getCostsByEpicId(epicId));
    }

    @PostMapping
    public ResponseEntity<CostResponse> createCost(@RequestBody CostRequest request) {
        return ResponseEntity.ok(costService.createCost(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCost(@PathVariable Long id) {
        costService.deleteCost(id);
        return ResponseEntity.noContent().build();
    }
}