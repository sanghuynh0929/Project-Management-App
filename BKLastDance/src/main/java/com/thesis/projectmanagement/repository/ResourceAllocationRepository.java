package com.thesis.projectmanagement.repository;

import com.thesis.projectmanagement.model.ResourceAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceAllocationRepository extends JpaRepository<ResourceAllocation, Long> {
    List<ResourceAllocation> findByEpicId(Long epicId);
}
