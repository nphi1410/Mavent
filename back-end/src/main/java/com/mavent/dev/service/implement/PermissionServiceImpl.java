package com.mavent.dev.service.implement;

import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service to handle permission checks for role assignments and member actions
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final EventAccountRoleRepository eventAccountRoleRepository;
    private final AccountService accountService;

    @Override
    public boolean canAssignAdminRole(Integer assignerAccountId) {
        if (assignerAccountId == null) {
            return false;
        }
        return accountService.isSuperAdmin(assignerAccountId);
    }

    @Override
    public boolean canAssignDepartmentManagerRole(Integer assignerAccountId, Integer eventId) {
        if (assignerAccountId == null) {
            return false;
        }
        return accountService.isSuperAdmin(assignerAccountId) || isEventAdmin(eventId, assignerAccountId);
    }

    @Override
    public boolean canBanAdmin(Integer assignerAccountId) {
        if (assignerAccountId == null) {
            return false;
        }
        return accountService.isSuperAdmin(assignerAccountId);
    }

    @Override
    public boolean canBanDepartmentManager(Integer assignerAccountId, Integer eventId) {
        if (assignerAccountId == null) {
            return false;
        }
        return accountService.isSuperAdmin(assignerAccountId) || isEventAdmin(eventId, assignerAccountId);
    }

    @Override
    public boolean isEventAdmin(Integer eventId, Integer accountId) {
        return eventAccountRoleRepository.findByEventIdAndAccountId(eventId, accountId)
                .map(role -> role.getEventRole() == EventAccountRole.EventRole.ADMIN && role.getIsActive())
                .orElse(false);
    }

    @Override
    public boolean hasUniqueAdminForEvent(Integer eventId, Integer excludedAccountId) {
        return eventAccountRoleRepository.findByEventIdAndEventRoleAndIsActive(
                eventId, EventAccountRole.EventRole.ADMIN, true).stream()
                .anyMatch(admin -> !admin.getAccountId().equals(excludedAccountId));
    }

    @Override
    public boolean hasUniqueDepartmentManager(Integer departmentId, Integer excludedAccountId) {
        return eventAccountRoleRepository.findByDepartmentId(departmentId).stream()
                .anyMatch(manager -> 
                    manager.getEventRole() == EventAccountRole.EventRole.DEPARTMENT_MANAGER && 
                    manager.getIsActive() && 
                    !manager.getAccountId().equals(excludedAccountId));
    }
}
