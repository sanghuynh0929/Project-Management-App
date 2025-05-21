package com.thesis.projectmanagement.integration;

import com.thesis.projectmanagement.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class ProjectManagementIntegrationTest {
    private Project project;
    private LocalDate projectStartDate;
    private Sprint sprint1;
    private Sprint sprint2;
    private Epic epic1;
    private Epic epic2;
    private List<WorkItem> workItems;

    @BeforeEach
    void setUp() {
        // Initialize project
        project = new Project();
        project.setName("Test Project");
        project.setDescription("Integration Test Project");
        project.onCreate();

        // Set project start date
        projectStartDate = LocalDate.of(2025, 5, 19);

        // Initialize work items list
        workItems = new ArrayList<>();
    }

    @Test
    void testCompleteProjectManagementFlow() {
        // 1. Create first sprint
        sprint1 = createSprint("Sprint 1", projectStartDate, projectStartDate.plusWeeks(2));
        project.getSprints().add(sprint1);
        assertEquals(1, project.getSprints().size());

        // 2. Create second sprint
        sprint2 = createSprint("Sprint 2", projectStartDate.plusWeeks(2), projectStartDate.plusWeeks(4));
        project.getSprints().add(sprint2);
        assertEquals(2, project.getSprints().size());

        // 3. Create epics
        epic1 = createEpic("Epic 1", projectStartDate, projectStartDate.plusMonths(3));
        epic2 = createEpic("Epic 2", projectStartDate.plusMonths(1), projectStartDate.plusMonths(4));
        project.getEpics().add(epic1);
        project.getEpics().add(epic2);
        assertEquals(2, project.getEpics().size());

        // 4. Create work items and add to backlog
        createWorkItems();
        assertEquals(10, project.getBacklog().size());

        // 5. Allocate some tasks to sprint 1
        allocateWorkItemsToSprint(sprint1, 0, 4);
        assertEquals(5, sprint1.getWorkItems().size());
        assertEquals(5, project.getBacklog().size());

        // 6. Allocate some backlog items to sprint 2
        allocateWorkItemsToSprint(sprint2, 5, 7);
        assertEquals(3, sprint2.getWorkItems().size());
        assertEquals(2, project.getBacklog().size());

        // 7. Move some tasks from sprint 1 to sprint 2
        moveWorkItemsBetweenSprints(sprint1, sprint2, 0, 2);
        assertEquals(2, sprint1.getWorkItems().size());
        assertEquals(6, sprint2.getWorkItems().size());

        // 8. Allocate work items to epics
        allocateWorkItemsToEpics();

        // Verify final state
        verifyFinalState();
    }

    private Sprint createSprint(String name, LocalDate startDate, LocalDate endDate) {
        Sprint sprint = new Sprint();
        sprint.setName(name);
        sprint.setStartDate(startDate);
        sprint.setEndDate(endDate);
        sprint.setProject(project);
        return sprint;
    }

    private Epic createEpic(String title, LocalDate startDate, LocalDate endDate) {
        Epic epic = new Epic();
        epic.setTitle(title);
        epic.setDescription("Test Epic Description");
        epic.setStartDate(startDate);
        epic.setEndDate(endDate);
        epic.setProject(project);
        return epic;
    }

    private void createWorkItems() {
        // Create 5 tasks
        for (int i = 0; i < 5; i++) {
            WorkItem task = createWorkItem("Task " + (i + 1), WorkItem.WorkItemType.TASK);
            workItems.add(task);
            project.getBacklog().add(task);
        }

        // Create 3 bugs
        for (int i = 0; i < 3; i++) {
            WorkItem bug = createWorkItem("Bug " + (i + 1), WorkItem.WorkItemType.BUG);
            workItems.add(bug);
            project.getBacklog().add(bug);
        }

        // Create 2 stories
        for (int i = 0; i < 2; i++) {
            WorkItem story = createWorkItem("Story " + (i + 1), WorkItem.WorkItemType.STORY);
            workItems.add(story);
            project.getBacklog().add(story);
        }
    }

    private WorkItem createWorkItem(String title, WorkItem.WorkItemType type) {
        WorkItem workItem = new WorkItem();
        workItem.setTitle(title);
        workItem.setDescription("Description for " + title);
        workItem.setType(type);
        workItem.setProject(project);
        workItem.setStartDate(projectStartDate);
        workItem.setEndDate(projectStartDate.plusDays(7));
        return workItem;
    }

    private void allocateWorkItemsToSprint(Sprint sprint, int startIndex, int endIndex) {
        for (int i = startIndex; i <= endIndex; i++) {
            WorkItem workItem = workItems.get(i);
            workItem.setSprint(sprint);
            sprint.getWorkItems().add(workItem);
            project.getBacklog().remove(workItem);
        }
    }

    private void moveWorkItemsBetweenSprints(Sprint fromSprint, Sprint toSprint, int startIndex, int endIndex) {
        List<WorkItem> itemsToMove = new ArrayList<>(fromSprint.getWorkItems().subList(startIndex, endIndex + 1));
        for (WorkItem workItem : itemsToMove) {
            fromSprint.getWorkItems().remove(workItem);
            workItem.setSprint(toSprint);
            toSprint.getWorkItems().add(workItem);
        }
    }

    private void allocateWorkItemsToEpics() {
        // Allocate first 5 work items to epic1
        for (int i = 0; i < 5; i++) {
            WorkItem workItem = workItems.get(i);
            workItem.setEpic(epic1);
            epic1.getWorkItems().add(workItem);
        }

        // Allocate remaining work items to epic2
        for (int i = 5; i < workItems.size(); i++) {
            WorkItem workItem = workItems.get(i);
            workItem.setEpic(epic2);
            epic2.getWorkItems().add(workItem);
        }
    }

    private void verifyFinalState() {
        // Verify project state
        assertNotNull(project);
        assertEquals(2, project.getSprints().size());
        assertEquals(2, project.getEpics().size());
        assertEquals(2, project.getBacklog().size());

        // Verify sprint 1 state
        assertEquals(2, sprint1.getWorkItems().size());
        assertTrue(sprint1.getWorkItems().stream()
                .allMatch(wi -> wi.getSprint() != null && wi.getSprint().equals(sprint1)));

        // Verify sprint 2 state
        assertEquals(6, sprint2.getWorkItems().size());
        assertTrue(sprint2.getWorkItems().stream()
                .allMatch(wi -> wi.getSprint() != null && wi.getSprint().equals(sprint2)));

        // Verify epic states
        assertEquals(5, epic1.getWorkItems().size());
        assertEquals(5, epic2.getWorkItems().size());
        
        // Verify work items are properly allocated to epics
        assertTrue(workItems.subList(0, 5).stream()
                .allMatch(wi -> wi.getEpic() != null && wi.getEpic().equals(epic1)));
        assertTrue(workItems.subList(5, 10).stream()
                .allMatch(wi -> wi.getEpic() != null && wi.getEpic().equals(epic2)));

        // Verify work item types distribution
        long taskCount = workItems.stream()
                .filter(wi -> wi.getType() == WorkItem.WorkItemType.TASK)
                .count();
        long bugCount = workItems.stream()
                .filter(wi -> wi.getType() == WorkItem.WorkItemType.BUG)
                .count();
        long storyCount = workItems.stream()
                .filter(wi -> wi.getType() == WorkItem.WorkItemType.STORY)
                .count();

        assertEquals(5, taskCount);
        assertEquals(3, bugCount);
        assertEquals(2, storyCount);

        // Verify all work items have proper relationships
        workItems.forEach(wi -> {
            assertNotNull(wi.getProject());
            assertNotNull(wi.getEpic());
            assertTrue(wi.getStartDate().isEqual(projectStartDate));
            assertTrue(wi.getEndDate().isEqual(projectStartDate.plusDays(7)));
        });

        // Verify work items are either in a sprint or in backlog
        workItems.forEach(wi -> {
            assertTrue(
                (wi.getSprint() != null && (wi.getSprint().equals(sprint1) || wi.getSprint().equals(sprint2))) ||
                project.getBacklog().contains(wi)
            );
        });
    }
} 