package com.mavent.dev.service.implement;

import com.mavent.dev.dto.member.UpdateMemberRequestDTO;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.exception.DuplicateRoleException;
import com.mavent.dev.exception.UnauthorizedException;
import com.mavent.dev.service.PermissionService;
import com.mavent.dev.service.RoleValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Validates role assignments and enforces business rules for exclusive roles
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RoleValidatorImpl implements RoleValidator {

    private final PermissionService permissionService;

    @Override
    public void validateRoleAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole) {
        if (request.getEventRole() == null) {
            return;
        }
        
        EventAccountRole.EventRole newRole = EventAccountRole.EventRole.valueOf(request.getEventRole());
        
        // Check if assigner has permission to assign this role
        if (newRole == EventAccountRole.EventRole.ADMIN) {
            validateAdminRoleAssignment(request, currentRole);
        } else if (newRole == EventAccountRole.EventRole.DEPARTMENT_MANAGER) {
            validateDepartmentManagerRoleAssignment(request, currentRole);
        }
    }

    @Override
    public void validateAdminRoleAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole) {
        // Only SUPER_ADMIN can assign ADMIN role
        if (!permissionService.canAssignAdminRole(request.getAssignedByAccountId())) {
            throw new UnauthorizedException("Chỉ SUPER_ADMIN mới có quyền gán vai trò ADMIN");
        }
        
        // Skip validation if this account already has the ADMIN role
        if (currentRole.getEventRole() == EventAccountRole.EventRole.ADMIN) {
            return;
        }
        
        // Check if another ADMIN exists for this event
        if (permissionService.hasUniqueAdminForEvent(request.getEventId(), request.getAccountId())) {
            throw new DuplicateRoleException(
                    "Không thể gán vai trò ADMIN. Sự kiện này đã có Admin");
        }
    }

    @Override
    public void validateDepartmentManagerRoleAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole) {
        // Only ADMIN or SUPER_ADMIN can assign DEPARTMENT_MANAGER role
        if (!permissionService.canAssignDepartmentManagerRole(request.getAssignedByAccountId(), request.getEventId())) {
            throw new UnauthorizedException(
                    "Chỉ ADMIN hoặc SUPER_ADMIN mới có quyền gán vai trò DEPARTMENT_MANAGER");
        }
        
        // Check for duplicate DEPARTMENT_MANAGER role for the department
        if (request.getDepartmentId() != null) {
            validateUniqueDepartmentManagerRole(request, currentRole);
        }
    }

    @Override
    public void validateUniqueDepartmentManagerRole(UpdateMemberRequestDTO request, EventAccountRole currentRole) {
        // Skip validation if this account already has the DEPARTMENT_MANAGER role for this department
        if (currentRole.getEventRole() == EventAccountRole.EventRole.DEPARTMENT_MANAGER && 
                request.getDepartmentId().equals(currentRole.getDepartmentId())) {
            return;
        }
        
        // Check if another DEPARTMENT_MANAGER exists for this department
        if (permissionService.hasUniqueDepartmentManager(request.getDepartmentId(), request.getAccountId())) {
            throw new DuplicateRoleException(
                    "Không thể gán vai trò DEPARTMENT_MANAGER. Phòng ban này đã có Manager");
        }
    }

    @Override
    public void validateDepartmentAssignment(UpdateMemberRequestDTO request, EventAccountRole currentRole) {
        if (request.getDepartmentId() == null) {
            return;
        }
        
        // If assigning DEPARTMENT_MANAGER role and changing department, validate uniqueness
        if ((currentRole.getEventRole() == EventAccountRole.EventRole.DEPARTMENT_MANAGER || 
                (request.getEventRole() != null && 
                 request.getEventRole().equals(EventAccountRole.EventRole.DEPARTMENT_MANAGER.name()))) && 
                !request.getDepartmentId().equals(currentRole.getDepartmentId())) {
            
            validateUniqueDepartmentManagerRole(request, currentRole);
        }
    }

    @Override
    public void validateBanPermission(Integer eventId, Integer accountId, Integer assignedByAccountId, EventAccountRole.EventRole role, boolean isBanned) {
        // Only check when trying to ban a user
        if (!isBanned) {
            return;
        }

        if (role == EventAccountRole.EventRole.ADMIN) {
            if (!permissionService.canBanAdmin(assignedByAccountId)) {
                throw new UnauthorizedException("Chỉ SUPER_ADMIN mới có quyền cấm ADMIN");
            }
        } else if (role == EventAccountRole.EventRole.DEPARTMENT_MANAGER) {
            if (!permissionService.canBanDepartmentManager(assignedByAccountId, eventId)) {
                throw new UnauthorizedException(
                        "Chỉ ADMIN hoặc SUPER_ADMIN mới có quyền cấm DEPARTMENT_MANAGER");
            }
        }
    }
}
