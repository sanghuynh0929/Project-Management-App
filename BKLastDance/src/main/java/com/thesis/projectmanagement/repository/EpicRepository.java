package com.thesis.projectmanagement.repository;

import com.thesis.projectmanagement.model.Epic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EpicRepository extends JpaRepository<Epic, Long> {
}
