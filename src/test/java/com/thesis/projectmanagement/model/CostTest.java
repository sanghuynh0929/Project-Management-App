package com.thesis.projectmanagement.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CostTest {
    private Cost cost;
    private WorkItem workItem;
    private Epic epic;

    @BeforeEach
    void setUp() {
        cost = new Cost();
        cost.setName("Test Cost");
        cost.setAmount(100.0);

        workItem = new WorkItem();
        workItem.setTitle("Test Work Item");

        epic = new Epic();
        epic.setTitle("Test Epic");
    }

    @Test
    void testCostCreation() {
        assertNotNull(cost);
        assertEquals("Test Cost", cost.getName());
        assertEquals(100.0, cost.getAmount());
    }

    @Test
    void testCostWorkItemRelationship() {
        cost.setWorkItem(workItem);
        assertEquals(workItem, cost.getWorkItem());
        assertNull(cost.getEpic());
    }

    @Test
    void testCostEpicRelationship() {
        cost.setEpic(epic);
        assertEquals(epic, cost.getEpic());
        assertNull(cost.getWorkItem());
    }

    @Test
    void testCostAmountValidation() {
        cost.setAmount(0.0);
        assertEquals(0.0, cost.getAmount());

        cost.setAmount(-100.0);
        assertEquals(-100.0, cost.getAmount());
    }

    @Test
    void testCostNameValidation() {
        cost.setName("");
        assertEquals("", cost.getName());

        cost.setName(null);
        assertNull(cost.getName());
    }
} 