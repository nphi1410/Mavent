package com.mavent.dev.exception;

/**
 * Exception thrown when validation fails.
 */
public class ValidationException extends RuntimeException {
    
    private final String field;
    
    public ValidationException(String message) {
        super(message);
        this.field = null;
    }
    
    public ValidationException(String field, String message) {
        super(message);
        this.field = field;
    }
    
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
        this.field = null;
    }
    
    public String getField() {
        return field;
    }
}
