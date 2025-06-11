package com.mavent.dev.util;

/**
 * Constants used throughout the application.
 */
public final class Constants {

    private Constants() {
        // Utility class - prevent instantiation
    }

    // API Response Messages
    public static final class Messages {
        public static final String SUCCESS = "Operation completed successfully";
        public static final String MEMBER_ADDED = "Member added successfully";
        public static final String MEMBER_UPDATED = "Member updated successfully";
        public static final String MEMBER_REMOVED = "Member removed successfully";
        public static final String MEMBER_BANNED = "Member banned successfully";
        public static final String MEMBER_UNBANNED = "Member unbanned successfully";
        public static final String MEMBERS_RETRIEVED = "Members retrieved successfully";
        public static final String MEMBER_NOT_FOUND = "Member not found";
        public static final String INSUFFICIENT_PERMISSION = "Insufficient permission to perform this operation";
        public static final String VALIDATION_FAILED = "Validation failed";
        public static final String INTERNAL_ERROR = "An internal error occurred";
    }

    // Default Values
    public static final class Defaults {
        public static final int DEFAULT_PAGE_SIZE = 10;
        public static final int MAX_PAGE_SIZE = 100;
        public static final int DEFAULT_PAGE_NUMBER = 0;
        public static final String DEFAULT_SORT_FIELD = "createdAt";
        public static final String DEFAULT_SORT_DIRECTION = "desc";
    }

    // Validation Constraints
    public static final class Validation {
        public static final int MIN_USERNAME_LENGTH = 3;
        public static final int MAX_USERNAME_LENGTH = 50;
        public static final int MIN_PASSWORD_LENGTH = 8;
        public static final int MAX_PASSWORD_LENGTH = 100;
        public static final int MAX_EMAIL_LENGTH = 100;
        public static final int MAX_FULL_NAME_LENGTH = 100;
        public static final int MAX_STUDENT_ID_LENGTH = 20;
        public static final int MAX_PHONE_LENGTH = 15;
        public static final int MAX_AVATAR_URL_LENGTH = 255;
    }

    // Event Role Permissions
    public static final class Permissions {
        // Roles that can manage members
        public static final String[] MEMBER_MANAGER_ROLES = {"ADMIN", "DEPARTMENT_MANAGER"};

        // Roles that can ban members
        public static final String[] MEMBER_BAN_ROLES = {"ADMIN"};

        // Roles that can remove members
        public static final String[] MEMBER_REMOVE_ROLES = {"ADMIN", "DEPARTMENT_MANAGER"};

        // Roles that can perform bulk operations
        public static final String[] BULK_OPERATION_ROLES = {"ADMIN"};
    }

    // Regex Patterns
    public static final class Patterns {
        public static final String USERNAME_PATTERN = "^[a-zA-Z0-9._-]+$";
        public static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$";
        public static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        public static final String PHONE_PATTERN = "^[+]?[0-9\\s-()]*$";
        public static final String STUDENT_ID_PATTERN = "^[A-Za-z0-9]{5,20}$";
    }

    // HTTP Headers
    public static final class Headers {
        public static final String CONTENT_TYPE = "Content-Type";
        public static final String ACCEPT = "Accept";
    }

    // Bulk Operation Types
    public static final class BulkOperations {
        public static final String BAN = "BAN";
        public static final String UNBAN = "UNBAN";
        public static final String REMOVE = "REMOVE";
        public static final String UPDATE_ROLE = "UPDATE_ROLE";
        public static final String UPDATE_DEPARTMENT = "UPDATE_DEPARTMENT";
    }
}
