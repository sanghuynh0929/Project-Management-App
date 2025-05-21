package com.thesis.projectmanagement.service.impl;

import com.thesis.projectmanagement.dto.person.PersonResponse;
import com.thesis.projectmanagement.dto.person.PersonRequest;
import com.thesis.projectmanagement.mapper.PersonMapper;
import com.thesis.projectmanagement.model.Person;
import com.thesis.projectmanagement.repository.PersonRepository;
import com.thesis.projectmanagement.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;

    @Override
    public List<PersonResponse> getAllPersons() {
        return personRepository.findAll().stream()
                .map(PersonMapper::toResponse)
                .toList();
    }

    @Override
    public PersonResponse createPerson(PersonRequest request) {
        Person person = PersonMapper.fromRequest(request);
        return PersonMapper.toResponse(personRepository.save(person));
    }

    @Override
    public PersonResponse updatePerson(Long id, PersonRequest request) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Person not found"));
        person.setName(request.getName());
        person.setEmail(request.getEmail());
        person.setRole(request.getRole());
        return PersonMapper.toResponse(personRepository.save(person));
    }

    @Override
    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }
}