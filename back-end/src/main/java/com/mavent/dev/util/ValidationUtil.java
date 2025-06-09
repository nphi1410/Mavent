package com.mavent.dev.util;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Utility class for validation operations.
 */
@Component
@RequiredArgsConstructor
public class ValidationUtil {

    private final Validator validator;

    /**
     * Validate an object and return validation errors as a string.
     */
    public <T> String validateAndGetErrors(T object) {
        Set<ConstraintViolation<T>> violations = validator.validate(object);
        if (violations.isEmpty()) {
            return null;
        }
        
        return violations.stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
    }

    /**
     * Validate an object and throw exception if invalid.
     */
    public <T> void validateAndThrow(T object) {
        String errors = validateAndGetErrors(object);
        if (errors != null) {
            throw new IllegalArgumentException("Validation failed: " + errors);
        }
    }

    /**
     * Check if an object is valid.
     */
    public <T> boolean isValid(T object) {
        return validator.validate(object).isEmpty();
    }

    /**
     * Get all validation errors for an object.
     */
    public <T> Set<ConstraintViolation<T>> getViolations(T object) {
        return validator.validate(object);
    }
    
    /**
     * Validate email format.
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    /**
     * Validate phone number format.
     */
    public static boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return true; // Optional field
        }
        return phoneNumber.matches("^[+]?[0-9\\s-()]{7,15}$");
    }
    
    /**
     * Validate student ID format.
     */
    public static boolean isValidStudentId(String studentId) {
        if (studentId == null || studentId.trim().isEmpty()) {
            return true; // Optional field
        }
        return studentId.matches("^[A-Za-z0-9]{5,20}$");
    }
}
