package com.thesis.projectmanagement.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EpicTest {
    private Epic epic;
    private Project project;

    @BeforeEach
    void setUp() {
        epic = new Epic();
        epic.setTitle("Test Epic");
        epic.setDescription("Test Description");
        epic.setStartDate(LocalDate.now());
        epic.setEndDate(LocalDate.now().plusDays(30));

        project = new Project();
        project.setName("Test Project");
    }

    @Test
    void testEpicCreation() {
        assertNotNull(epic);
        assertEquals("Test Epic", epic.getTitle());
        assertEquals("Test Description", epic.getDescription());
        assertNotNull(epic.getStartDate());
        assertNotNull(epic.getEndDate());
    }

    @Test
    void testEpicProjectRelationship() {
        epic.setProject(project);
        assertEquals(project, epic.getProject());
    }

    @Test
    void testEpicWorkItems() {
        WorkItem workItem = new WorkItem();
        workItem.setTitle("Test Work Item");
        
        epic.getWorkItems().add(workItem);
        assertEquals(1, epic.getWorkItems().size());
        assertEquals(workItem, epic.getWorkItems().get(0));
    }

    @Test
    void testEpicCosts() {
        Cost cost = new Cost();
        cost.setName("Test Cost");
        cost.setAmount(1000.0);

        epic.getCosts().add(cost);
        assertEquals(1, epic.getCosts().size());
        assertEquals(cost, epic.getCosts().get(0));
    }

    @Test
    void testEpicDependencies() {
        Epic dependentEpic = new Epic();
        dependentEpic.setTitle("Dependent Epic");

        epic.getDependencies().add(dependentEpic);
        assertEquals(1, epic.getDependencies().size());
        assertEquals(dependentEpic, epic.getDependencies().get(0));
    }

    @Test
    void testEpicAssignees() {
        Person person = new Person();
        person.setName("Test Person");

        epic.getAssignees().add(person);
        assertEquals(1, epic.getAssignees().size());
        assertEquals(person, epic.getAssignees().get(0));
    }

    @Test
    void testEpicDateRange() {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(30);
        
        epic.setStartDate(startDate);
        epic.setEndDate(endDate);
        
        assertTrue(epic.getEndDate().isAfter(epic.getStartDate()));
        assertEquals(30, epic.getEndDate().toEpochDay() - epic.getStartDate().toEpochDay());
    }
} 