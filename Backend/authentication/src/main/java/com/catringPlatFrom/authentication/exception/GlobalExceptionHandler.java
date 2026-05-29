package com.catringPlatFrom.authentication.exception;

import com.catringPlatFrom.authentication.exception.custom.EmailAlreadyExistsException;
import com.catringPlatFrom.authentication.exception.custom.InvalidPasswordException;
import com.catringPlatFrom.authentication.exception.custom.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice

public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)

    public ResponseEntity<Map<String, Object>>
    handleUserNotFound(UserNotFoundException ex) {

        return buildResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)

    public ResponseEntity<Map<String, Object>>
    handleEmailExists(EmailAlreadyExistsException ex) {

        return buildResponse(
                ex.getMessage(),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(InvalidPasswordException.class)

    public ResponseEntity<Map<String, Object>>
    handleInvalidPassword(InvalidPasswordException ex) {

        return buildResponse(
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)

    public ResponseEntity<Map<String, Object>>
    handleValidation(
            MethodArgumentNotValidException ex
    ) {

        String errors = ex.getBindingResult()

                .getFieldErrors()

                .stream()

                .map(error ->

                        error.getField()
                                + " : "
                                + error.getDefaultMessage()
                )

                .collect(Collectors.joining(", "));

        return buildResponse(
                errors,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(Exception.class)

    public ResponseEntity<Map<String, Object>>
    handleException(Exception ex) {

        return buildResponse(
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    private ResponseEntity<Map<String, Object>>
    buildResponse(
            String message,
            HttpStatus status
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put("timestamp", LocalDateTime.now());

        response.put("status", status.value());

        response.put("error", message);

        return new ResponseEntity<>(
                response,
                status
        );
    }
}