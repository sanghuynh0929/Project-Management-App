package com.thesis.projectmanagement.model;

import com.thesis.projectmanagement.constants.enums.EpicStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Epic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    private EpicStatus status;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "epic")
    private List<WorkItem> workItems = new ArrayList<>();

    @OneToMany(mappedBy = "epic", cascade = CascadeType.ALL)
    private List<Cost> costs = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "epic_dependencies",
        joinColumns = @JoinColumn(name = "epic_id"),
        inverseJoinColumns = @JoinColumn(name = "dependent_epic_id")
    )
    private List<Epic> dependencies = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "epic_assignees",
        joinColumns = @JoinColumn(name = "epic_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> assignees = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "team_id")           // FK mới
    private Team team;

}