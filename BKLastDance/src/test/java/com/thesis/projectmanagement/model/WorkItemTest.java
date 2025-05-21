package com.thesis.projectmanagement.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class WorkItemTest {
    private WorkItem workItem;
    private Project project;
    private Sprint sprint;
    private Epic epic;

    @BeforeEach
    void setUp() {
        workItem = new WorkItem();
        workItem.setTitle("Test Work Item");
        workItem.setDescription("Test Description");
        workItem.setStartDate(LocalDate.now());
        workItem.setEndDate(LocalDate.now().plusDays(7));
        workItem.setType(WorkItem.WorkItemType.TASK);

        project = new Project();
        project.setName("Test Project");

        sprint = new Sprint();
        sprint.setName("Test Sprint");

        epic = new Epic();
        epic.setTitle("Test Epic");
    }

    @Test
    void testWorkItemCreation() {
        assertNotNull(workItem);
        assertEquals("Test Work Item", workItem.getTitle());
        assertEquals("Test Description", workItem.getDescription());
        assertEquals(WorkItem.WorkItemType.TASK, workItem.getType());
        assertNotNull(workItem.getStartDate());
        assertNotNull(workItem.getEndDate());
    }

    @Test
    void testWorkItemRelationships() {
        workItem.setProject(project);
        workItem.setSprint(sprint);
        workItem.setEpic(epic);

        assertEquals(project, workItem.getProject());
        assertEquals(sprint, workItem.getSprint());
        assertEquals(epic, workItem.getEpic());
    }

    @Test
    void testWorkItemDependencies() {
        WorkItem dependentWorkItem = new WorkItem();
        dependentWorkItem.setTitle("Dependent Work Item");

        workItem.getDependencies().add(dependentWorkItem);
        assertEquals(1, workItem.getDependencies().size());
        assertEquals(dependentWorkItem, workItem.getDependencies().get(0));
    }

    @Test
    void testWorkItemCosts() {
        Cost cost = new Cost();
        cost.setName("Test Cost");
        cost.setAmount(100.0);

        workItem.getCosts().add(cost);
        assertEquals(1, workItem.getCosts().size());
        assertEquals(cost, workItem.getCosts().get(0));
    }

    @Test
    void testWorkItemAssignees() {
        Person person = new Person();
        person.setName("Test Person");

        workItem.getAssignees().add(person);
        assertEquals(1, workItem.getAssignees().size());
        assertEquals(person, workItem.getAssignees().get(0));
    }

    @Test
    void testWorkItemTypeValidation() {
        workItem.setType(WorkItem.WorkItemType.STORY);
        assertEquals(WorkItem.WorkItemType.STORY, workItem.getType());

        workItem.setType(WorkItem.WorkItemType.BUG);
        assertEquals(WorkItem.WorkItemType.BUG, workItem.getType());
    }
} 