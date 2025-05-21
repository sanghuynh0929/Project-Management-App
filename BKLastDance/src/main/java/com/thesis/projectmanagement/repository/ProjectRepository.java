package com.thesis.projectmanagement.repository;

import com.thesis.projectmanagement.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}