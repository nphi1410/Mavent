package com.mavent.dev.exception;

/**
 * Exception thrown when a member is not found.
 */
public class MemberNotFoundException extends RuntimeException {
    
    public MemberNotFoundException(String message) {
        super(message);
    }
    
    public MemberNotFoundException(Integer eventId, Integer accountId) {
        super(String.format("Member not found for event ID: %d and account ID: %d", eventId, accountId));
    }
    
    public MemberNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
