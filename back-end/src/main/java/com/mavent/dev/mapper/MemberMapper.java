package com.mavent.dev.mapper;

import com.mavent.dev.dto.member.MemberResponseDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Department;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Member entities and DTOs.
 * Handles the mapping logic between database entities and data transfer objects.
 */
@Component
public class MemberMapper {

    private final AccountRepository accountRepository;

    private DepartmentRepository departmentRepository;

    public MemberMapper(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Autowired
    public MemberMapper(AccountRepository accountRepository, DepartmentRepository departmentRepository) {
        this.accountRepository = accountRepository;
        this.departmentRepository = departmentRepository;
    }

    /**
     * Convert EventAccountRole entity to MemberResponseDTO.
     */
    public MemberResponseDTO toMemberResponseDTO(EventAccountRole eventAccountRole) {
        if (eventAccountRole == null) {
            return null;
        }        // Fetch related entities using IDs
        Account account = accountRepository.findById(eventAccountRole.getAccountId()).orElse(null);
        Department department = eventAccountRole.getDepartmentId() != null ?
                departmentRepository.findById(eventAccountRole.getDepartmentId()).orElse(null) : null;
        Account assignedBy = eventAccountRole.getAssignedByAccountId() != null ?
                accountRepository.findById(eventAccountRole.getAssignedByAccountId()).orElse(null) : null;

        return memberResponseDTOBuilder(eventAccountRole, account, department, assignedBy);
    }

    /**
     * Convert EventAccountRole entity to MemberResponseDTO using preloaded data.
     * This prevents N+1 queries by using already loaded account and department maps.
     */
    public MemberResponseDTO toMemberResponseWithPreloadedData(
            EventAccountRole eventAccountRole,
            Map<Integer, Account> accountMap,
            Map<Integer, Department> departmentMap) {
        
        if (eventAccountRole == null) {
            return null;
        }
        
        Account account = accountMap.get(eventAccountRole.getAccountId());
        Department department = eventAccountRole.getDepartmentId() != null ?
                departmentMap.get(eventAccountRole.getDepartmentId()) : null;
        Account assignedBy = eventAccountRole.getAssignedByAccountId() != null ?
                accountMap.get(eventAccountRole.getAssignedByAccountId()) : null;

        return memberResponseDTOBuilder(eventAccountRole, account, department, assignedBy);
    }

    private MemberResponseDTO memberResponseDTOBuilder(EventAccountRole eventAccountRole, Account account, Department department, Account assignedBy) {
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
                .eventId(eventAccountRole.getEventId())
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

    public List<MemberResponseDTO> toListMemberResponseWithPreloadedData(List<EventAccountRole> list) {
        // Optimization: Batch load accounts and departments to prevent N+1 queries
        Set<Integer> accountIds = new HashSet<>();
        Set<Integer> departmentIds = new HashSet<>();

        // Collect all needed IDs
        for (EventAccountRole member : list) {
            accountIds.add(member.getAccountId());
            if (member.getAssignedByAccountId() != null) {
                accountIds.add(member.getAssignedByAccountId());
            }
            if (member.getDepartmentId() != null) {
                departmentIds.add(member.getDepartmentId());
            }
        }

        // Batch load accounts and departments
        Map<Integer, Account> accountMap = accountRepository.findAllById(accountIds).stream()
                .collect(Collectors.toMap(Account::getAccountId, account -> account));

        Map<Integer, Department> departmentMap = departmentRepository.findAllById(departmentIds).stream()
                .collect(Collectors.toMap(Department::getDepartmentId, department -> department));

        // Map to DTOs with preloaded data
        return list.stream()
                .map(member -> toMemberResponseWithPreloadedData(member, accountMap, departmentMap))
                .collect(Collectors.toList());

    }

    /**
     * Get display name from full name or username.
     */
    private String getDisplayName(String fullName, String username) {
        return fullName != null && !fullName.trim().isEmpty() ? fullName : username;
    }

    public Account toEntity(MemberResponseDTO memberResponseDTO) {
        if (memberResponseDTO == null) {
            return null;
        }

        return Account.builder()
                .accountId(memberResponseDTO.getAccountId())
                .username(memberResponseDTO.getUsername())
                .email(memberResponseDTO.getEmail())
                .fullName(memberResponseDTO.getFullName())
                .studentId(memberResponseDTO.getStudentId())
                .dateOfBirth(memberResponseDTO.getDateOfBirth())
                .phoneNumber(memberResponseDTO.getPhoneNumber())
                .gender(Account.Gender.valueOf(memberResponseDTO.getGender()))
                .avatarUrl(memberResponseDTO.getAvatarUrl())
                .systemRole(Account.SystemRole.valueOf(memberResponseDTO.getSystemRole()))
                .build();
    }
}
