package com.thesis.projectmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class DataAlreadyExistsException extends RuntimeException {
    public DataAlreadyExistsException(String message){
        super(message);
    }

}