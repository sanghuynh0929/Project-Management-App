package com.thesis.projectmanagement.service;

import com.thesis.projectmanagement.dto.person.PersonRequest;
import com.thesis.projectmanagement.dto.person.PersonResponse;

import java.util.List;

public interface PersonService {
    List<PersonResponse> getAllPersons();
    PersonResponse createPerson(PersonRequest request);
    PersonResponse updatePerson(Long id, PersonRequest request);
    void deletePerson(Long id);
}