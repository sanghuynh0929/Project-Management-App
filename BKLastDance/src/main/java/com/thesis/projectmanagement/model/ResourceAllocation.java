package com.thesis.projectmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "resource_allocation")
public class ResourceAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double fte;


    @ManyToOne
    @JoinColumn(name = "epic_id")
    private Epic epic;

    @ManyToOne @JoinColumn(name = "person_id")
    private Person person;

    @ManyToOne @JoinColumn(name = "sprint_id")
    private Sprint sprint;
}


