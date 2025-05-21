package com.thesis.projectmanagement.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProjectTest {
    private Project project;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setName("Test Project");
        project.setDescription("Test Description");
    }

    @Test
    void testProjectCreation() {
        assertNotNull(project);
        assertEquals("Test Project", project.getName());
        assertEquals("Test Description", project.getDescription());
    }

    @Test
    void testProjectTimestamps() {
        project.onCreate();
        assertNotNull(project.getCreatedAt());
        assertNotNull(project.getUpdatedAt());
        
        LocalDateTime originalUpdatedAt = project.getUpdatedAt();
        project.onUpdate();
        assertTrue(project.getUpdatedAt().isAfter(originalUpdatedAt));
    }

    @Test
    void testProjectRelationships() {
        Sprint sprint = new Sprint();
        WorkItem workItem = new WorkItem();
        Epic epic = new Epic();

        project.getSprints().add(sprint);
        project.getBacklog().add(workItem);
        project.getEpics().add(epic);

        assertEquals(1, project.getSprints().size());
        assertEquals(1, project.getBacklog().size());
        assertEquals(1, project.getEpics().size());
    }
} 