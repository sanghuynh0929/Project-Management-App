package com.thesis.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double amount;
    private String description;
    private String type;

    @ManyToOne
    @JoinColumn(name = "work_item_id")
    private WorkItem workItem;

    @ManyToOne
    @JoinColumn(name = "epic_id")
    private Epic epic;
} 