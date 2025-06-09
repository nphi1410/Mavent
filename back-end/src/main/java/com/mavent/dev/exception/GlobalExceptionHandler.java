package com.mavent.dev.exception;

import com.mavent.dev.dto.common.ApiResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 * Provides centralized exception handling and consistent error responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleMemberNotFoundException(
            MemberNotFoundException ex, WebRequest request) {
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InsufficientPermissionException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleInsufficientPermissionException(
            InsufficientPermissionException ex, WebRequest request) {
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleBusinessLogicException(
            BusinessLogicException ex, WebRequest request) {
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleValidationException(
            ValidationException ex, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        if (ex.getField() != null) {
            errors.put(ex.getField(), ex.getMessage());
        }
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message(ex.getMessage())
                .data(errors.isEmpty() ? null : errors)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message("Validation failed")
                .data(errors)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO<Object>> handleGlobalException(
            Exception ex, WebRequest request) {
        
        ApiResponseDTO<Object> response = ApiResponseDTO.<Object>builder()
                .success(false)
                .message("An unexpected error occurred: " + ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now().toString())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
