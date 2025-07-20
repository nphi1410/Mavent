package com.mavent.dev.service;

import com.mavent.dev.dto.member.UpdateMemberRequestDTO;
import com.mavent.dev.entity.EventAccountRole;

/**
 * Validates role assignments and enforces business rules
 */
public interface RoleValidator {

    /**
     * Validate complete role assignment
     */
    void validateRoleAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole);

    /**
     * Validate ADMIN role assignment
     */
    void validateAdminRoleAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole);

    /**
     * Validate DEPARTMENT_MANAGER role assignment
     */
    void validateDepartmentManagerRoleAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole);

    /**
     * Validate uniqueness of DEPARTMENT_MANAGER role for a department
     */
    void validateUniqueDepartmentManagerRole(UpdateMemberRequestDTO request, EventAccountRole currentRole);

    /**
     * Validate department assignment
     */
    void validateDepartmentAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole);
    
    /**
     * Validate permissions for banning members
     */
    void validateBanPermission(Integer eventId, Integer accountId, Integer assignedByAccountId, 
                              EventAccountRole.EventRole role, boolean isBanned);
}
