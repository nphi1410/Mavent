package com.mavent.dev.mapper;

import com.mavent.dev.dto.member.MemberResponseDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Department;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Member entities and DTOs.
 * Handles the mapping logic between database entities and data transfer objects.
 */
@Component
public class MemberMapper {

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;

    /**
     * Convert EventAccountRole entity to MemberResponseDTO.
     */
    public MemberResponseDTO toMemberResponseDTO(EventAccountRole eventAccountRole) {
        if (eventAccountRole == null) {
            return null;
        }

        // Fetch related entities using IDs
        Account account = accountRepository.findById(eventAccountRole.getId().getAccountId()).orElse(null);
        Department department = eventAccountRole.getDepartmentId() != null ? 
                               departmentRepository.findById(eventAccountRole.getDepartmentId()).orElse(null) : null;
        Account assignedBy = eventAccountRole.getAssignedByAccountId() != null ? 
                           accountRepository.findById(eventAccountRole.getAssignedByAccountId()).orElse(null) : null;

        return MemberResponseDTO.builder()
                // Account Information
                .accountId(account != null ? account.getAccountId() : null)
                .username(account != null ? account.getUsername() : null)
                .email(account != null ? account.getEmail() : null)
                .fullName(account != null ? account.getFullName() : null)
                .studentId(account != null ? account.getStudentId() : null)
                .dateOfBirth(account != null ? account.getDateOfBirth() : null)
                .phoneNumber(account != null ? account.getPhoneNumber() : null)
                .gender(account != null && account.getGender() != null ? account.getGender().name() : null)
                .avatarUrl(account != null ? account.getAvatarUrl() : null)
                .systemRole(account != null && account.getSystemRole() != null ? account.getSystemRole().name() : null)
                
                // Event Role Information
                .eventId(eventAccountRole.getId().getEventId())
                .eventRole(eventAccountRole.getEventRole().name())
                .departmentId(eventAccountRole.getDepartmentId())
                .departmentName(department != null ? department.getName() : null)
                .isActive(eventAccountRole.getIsActive())
                .assignedByAccountId(eventAccountRole.getAssignedByAccountId())
                .assignedByName(assignedBy != null ? 
                               getDisplayName(assignedBy.getFullName(), assignedBy.getUsername()) : null)
                .joinedAt(eventAccountRole.getCreatedAt())
                .updatedAt(eventAccountRole.getUpdatedAt())
                .build();
    }

    /**
     * Get display name from full name or username.
     */
    private String getDisplayName(String fullName, String username) {
        return fullName != null && !fullName.trim().isEmpty() ? fullName : username;
    }
}
