package com.thesis.projectmanagement.repository;

import com.thesis.projectmanagement.model.Cost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CostRepository extends JpaRepository<Cost, Long> {
    List<Cost> findByEpicId(Long epicId);
    List<Cost> findByEpicProjectId(Long projectId);
}
