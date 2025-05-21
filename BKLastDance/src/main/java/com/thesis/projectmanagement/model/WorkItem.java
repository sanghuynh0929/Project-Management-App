package com.thesis.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class WorkItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private WorkItemType type;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "epic_id")
    private Epic epic;

    @OneToMany(mappedBy = "workItem", cascade = CascadeType.ALL)
    private List<Cost> costs = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "work_item_dependencies",
        joinColumns = @JoinColumn(name = "work_item_id"),
        inverseJoinColumns = @JoinColumn(name = "dependent_work_item_id")
    )
    private List<WorkItem> dependencies = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "work_item_assignees",
        joinColumns = @JoinColumn(name = "work_item_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> assignees = new ArrayList<>();

    public enum WorkItemType {
        TASK,
        STORY,
        BUG
    }
} 