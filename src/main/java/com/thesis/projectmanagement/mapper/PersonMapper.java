package com.thesis.projectmanagement.mapper;

import com.thesis.projectmanagement.dto.person.PersonRequest;
import com.thesis.projectmanagement.dto.person.PersonResponse;
import com.thesis.projectmanagement.model.Person;

public class PersonMapper {

    public static Person fromRequest(PersonRequest req) {
        Person person = new Person();
        person.setName(req.getName());
        person.setEmail(req.getEmail());
        person.setRole(req.getRole());
        return person;
    }

    public static PersonResponse toResponse(Person entity) {
        PersonResponse dto = new PersonResponse();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setRole(entity.getRole());
        return dto;
    }
}
