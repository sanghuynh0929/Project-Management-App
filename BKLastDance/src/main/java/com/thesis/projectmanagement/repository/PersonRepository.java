package com.thesis.projectmanagement.repository;

import com.thesis.projectmanagement.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
}