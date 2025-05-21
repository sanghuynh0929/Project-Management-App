package com.thesis.projectmanagement.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class PersonTest {
    private Person person;
    private WorkItem workItem;
    private Epic epic;

    @BeforeEach
    void setUp() {
        person = new Person();
        person.setName("Test Person");
        person.setEmail("test@example.com");
        person.setRole("Developer");

        workItem = new WorkItem();
        workItem.setTitle("Test Work Item");

        epic = new Epic();
        epic.setTitle("Test Epic");
    }

    @Test
    void testPersonCreation() {
        assertNotNull(person);
        assertEquals("Test Person", person.getName());
        assertEquals("test@example.com", person.getEmail());
        assertEquals("Developer", person.getRole());
    }

    @Test
    void testWorkItemHoursAllocation() {
        person.getWorkItemHours().put(workItem, 40.0);
        assertEquals(1, person.getWorkItemHours().size());
        assertEquals(40.0, person.getWorkItemHours().get(workItem));
    }

    @Test
    void testEpicHoursAllocation() {
        person.getEpicHours().put(epic, 160.0);
        assertEquals(1, person.getEpicHours().size());
        assertEquals(160.0, person.getEpicHours().get(epic));
    }

    @Test
    void testMultipleWorkItemHours() {
        WorkItem workItem2 = new WorkItem();
        workItem2.setTitle("Test Work Item 2");

        person.getWorkItemHours().put(workItem, 20.0);
        person.getWorkItemHours().put(workItem2, 30.0);

        assertEquals(2, person.getWorkItemHours().size());
        assertEquals(20.0, person.getWorkItemHours().get(workItem));
        assertEquals(30.0, person.getWorkItemHours().get(workItem2));
    }

    @Test
    void testMultipleEpicHours() {
        Epic epic2 = new Epic();
        epic2.setTitle("Test Epic 2");

        person.getEpicHours().put(epic, 80.0);
        person.getEpicHours().put(epic2, 120.0);

        assertEquals(2, person.getEpicHours().size());
        assertEquals(80.0, person.getEpicHours().get(epic));
        assertEquals(120.0, person.getEpicHours().get(epic2));
    }

    @Test
    void testUpdateWorkItemHours() {
        person.getWorkItemHours().put(workItem, 40.0);
        person.getWorkItemHours().put(workItem, 50.0);
        assertEquals(50.0, person.getWorkItemHours().get(workItem));
    }

    @Test
    void testUpdateEpicHours() {
        person.getEpicHours().put(epic, 160.0);
        person.getEpicHours().put(epic, 200.0);
        assertEquals(200.0, person.getEpicHours().get(epic));
    }
} 