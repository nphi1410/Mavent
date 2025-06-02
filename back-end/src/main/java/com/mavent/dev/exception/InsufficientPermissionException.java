package com.mavent.dev.exception;

/**
 * Exception thrown when a user does not have sufficient permissions to perform an operation.
 */
public class InsufficientPermissionException extends RuntimeException {
    
    public InsufficientPermissionException(String message) {
        super(message);
    }
    
    public InsufficientPermissionException(String operation, String requiredRole) {
        super(String.format("Insufficient permission to perform '%s'. Required role: %s", operation, requiredRole));
    }
    
    public InsufficientPermissionException(String message, Throwable cause) {
        super(message, cause);
    }
}
