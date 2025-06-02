package com.mavent.dev.exception;

/**
 * Exception thrown when there's a conflict in business logic (e.g., duplicate member, invalid state).
 */
public class BusinessLogicException extends RuntimeException {
    
    public BusinessLogicException(String message) {
        super(message);
    }
    
    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }
}
