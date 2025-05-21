package com.thesis.projectmanagement.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SprintTest {
    private Sprint sprint;
    private Project project;

    @BeforeEach
    void setUp() {
        sprint = new Sprint();
        sprint.setName("Test Sprint");
        sprint.setStartDate(LocalDate.now());
        sprint.setEndDate(LocalDate.now().plusDays(14));
        
        project = new Project();
        project.setName("Test Project");
    }

    @Test
    void testSprintCreation() {
        assertNotNull(sprint);
        assertEquals("Test Sprint", sprint.getName());
        assertNotNull(sprint.getStartDate());
        assertNotNull(sprint.getEndDate());
        assertTrue(sprint.getEndDate().isAfter(sprint.getStartDate()));
    }

    @Test
    void testSprintProjectRelationship() {
        sprint.setProject(project);
        assertEquals(project, sprint.getProject());
    }

    @Test
    void testSprintWorkItems() {
        WorkItem workItem = new WorkItem();
        workItem.setTitle("Test Work Item");
        
        sprint.getWorkItems().add(workItem);
        assertEquals(1, sprint.getWorkItems().size());
        assertEquals(workItem, sprint.getWorkItems().get(0));
    }

    @Test
    void testSprintDateValidation() {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.minusDays(1);
        
        sprint.setStartDate(startDate);
        sprint.setEndDate(endDate);
        
        assertTrue(sprint.getEndDate().isBefore(sprint.getStartDate()));
    }
} 