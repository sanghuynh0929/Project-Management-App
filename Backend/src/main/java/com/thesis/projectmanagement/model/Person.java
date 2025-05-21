package com.thesis.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String role;

    @ElementCollection
    @CollectionTable(name = "person_work_item_hours")
    @MapKeyJoinColumn(name = "work_item_id")
    @Column(name = "hours")
    private Map<WorkItem, Double> workItemHours = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "person_epic_hours")
    @MapKeyJoinColumn(name = "epic_id")
    @Column(name = "hours")
    private Map<Epic, Double> epicHours = new HashMap<>();
} 