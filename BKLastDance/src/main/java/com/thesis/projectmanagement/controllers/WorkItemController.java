package com.thesis.projectmanagement.controllers;

import com.thesis.projectmanagement.dto.workItem.WorkItemRequest;
import com.thesis.projectmanagement.dto.workItem.WorkItemResponse;
import com.thesis.projectmanagement.service.WorkItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkItemController {

    private final WorkItemService workItemService;

    @GetMapping("/epic/{epicId}")
    public ResponseEntity<List<WorkItemResponse>> getWorkItemsByEpic(@PathVariable Long epicId) {
        return ResponseEntity.ok(workItemService.getWorkItemsByEpicId(epicId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkItemResponse> getWorkItemById(@PathVariable Long id) {
        return ResponseEntity.ok(workItemService.getWorkItemById(id));
    }

    @PostMapping
    public ResponseEntity<WorkItemResponse> createWorkItem(@RequestBody WorkItemRequest request) {
        return ResponseEntity.ok(workItemService.createWorkItem(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkItemResponse> updateWorkItem(@PathVariable Long id, @RequestBody WorkItemRequest request) {
        return ResponseEntity.ok(workItemService.updateWorkItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkItem(@PathVariable Long id) {
        workItemService.deleteWorkItem(id);
        return ResponseEntity.noContent().build();
    }
}