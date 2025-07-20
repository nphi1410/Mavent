package com.mavent.dev.service;

/**
 * Service interface for role-based permission checks
 */
public interface PermissionService {

    /**
     * Check if user can assign ADMIN role
     */
    boolean canAssignAdminRole(Integer assignerAccountId);

    /**
     * Check if user can assign DEPARTMENT_MANAGER role
     */
    boolean canAssignDepartmentManagerRole(Integer assignerAccountId, Integer eventId);

    /**
     * Check if user can ban an ADMIN
     */
    boolean canBanAdmin(Integer assignerAccountId);

    /**
     * Check if user can ban a DEPARTMENT_MANAGER
     */
    boolean canBanDepartmentManager(Integer assignerAccountId, Integer eventId);

    /**
     * Check if user is an event admin
     */
    boolean isEventAdmin(Integer eventId, Integer accountId);

    /**
     * Check if event has a unique admin (excluding specified account)
     */
    boolean hasUniqueAdminForEvent(Integer eventId, Integer excludedAccountId);

    /**
     * Check if department has a unique manager (excluding specified account)
     */
    boolean hasUniqueDepartmentManager(Integer departmentId, Integer excludedAccountId);
}
