package com.mavent.dev.service.implement;

import com.mavent.dev.dto.member.BanMemberRequestDTO;
import com.mavent.dev.dto.member.MemberResponseDTO;
import com.mavent.dev.dto.member.UpdateMemberRequestDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Department;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.exception.MemberNotFoundException;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.MemberService;
import com.mavent.dev.service.PermissionService;
import com.mavent.dev.service.RoleValidator;
import com.mavent.dev.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Simplified implementation of MemberService.
 * No authentication/authorization - just core member management for frontend integration.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberImplement implements MemberService {

    private final EventAccountRoleRepository eventAccountRoleRepository;
    private final AccountRepository accountRepository;
    private final DepartmentRepository departmentRepository;
    private final MemberMapper memberMapper;
    private final RoleValidator roleValidator;
    private final PermissionService permissionService;
    
    @Override
    @Transactional(readOnly = true)
    public List<MemberResponseDTO> getAllMembersByEventId(Integer eventId) {
        // Lấy danh sách EventAccountRole cho event
        List<EventAccountRole> members = eventAccountRoleRepository.findByEventId(eventId);
        
        // Optimization: Batch load accounts and departments to prevent N+1 queries
        Set<Integer> accountIds = new HashSet<>();
        Set<Integer> departmentIds = new HashSet<>();
        
        // Collect all needed IDs
        for (EventAccountRole member : members) {
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
        return members.stream()
                .map(member -> memberMapper.toMemberResponseWithPreloadedData(member, accountMap, departmentMap))
                .collect(Collectors.toList());
    }
    


    @Override
    @Transactional(readOnly = true)
    public MemberResponseDTO getMemberDetails(Integer eventId, Integer accountId) {
        EventAccountRole memberRole = findEventAccountRole(eventId, accountId);
        return memberMapper.toMemberResponseDTO(memberRole);
    }

    @Override
    public MemberResponseDTO updateMember(UpdateMemberRequestDTO request) {
        // Find existing member role
        EventAccountRole memberRole = findEventAccountRole(request.getEventId(), request.getAccountId());

        // Update role if provided - using roleValidator to enforce business rules
        if (request.getEventRole() != null) {
            roleValidator.validateRoleAssignment(request, memberRole);
            memberRole.setEventRole(EventAccountRole.EventRole.valueOf(request.getEventRole()));
        }

        // Update department if provided - using roleValidator for department validation
        if (request.getDepartmentId() != null) {
            roleValidator.validateDepartmentAssignment(request, memberRole);
            memberRole.setDepartmentId(request.getDepartmentId());
        }

        // Update isActive status if provided
        if (request.getIsActive() != null) {
            memberRole.setIsActive(request.getIsActive());
        }

        // Lưu và đảm bảo dữ liệu được flush ngay lập tức đến database
        EventAccountRole updated = eventAccountRoleRepository.saveAndFlush(memberRole);

        return memberMapper.toMemberResponseDTO(updated);
    }

    @Override
    public MemberResponseDTO banMember(BanMemberRequestDTO request) {
        // Find existing member role
        EventAccountRole memberRole = findEventAccountRole(request.getEventId(), request.getAccountId());
        
        // Validate ban permissions using roleValidator
        roleValidator.validateBanPermission(
            request.getEventId(), 
            request.getAccountId(), 
            request.getAssignedByAccountId(),
            memberRole.getEventRole(),
            request.getIsBanned()
        );

        // Update active status
        memberRole.setIsActive(!request.getIsBanned());

        // Save the updated role
        EventAccountRole updated = eventAccountRoleRepository.saveAndFlush(memberRole);

        return memberMapper.toMemberResponseDTO(updated);
    }
    
    /**
     * Find a member role by event and account IDs or throw exception if not found
     */
    private EventAccountRole findEventAccountRole(Integer eventId, Integer accountId) {
        return eventAccountRoleRepository.findByEventIdAndAccountId(eventId, accountId)
                .orElseThrow(() -> new MemberNotFoundException(eventId, accountId));
    }

}


