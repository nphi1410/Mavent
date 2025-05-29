package com.mavent.dev.service.implement;

import com.mavent.dev.dto.member.*;
import com.mavent.dev.dto.common.PagedResponseDTO;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.EventAccountRoleId;
import com.mavent.dev.exception.MemberNotFoundException;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.MemberService;
import com.mavent.dev.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Simplified implementation of MemberService.
 * No authentication/authorization - just core member management for frontend integration.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberServiceImpl implements MemberService {

    private final EventAccountRoleRepository eventAccountRoleRepository;
    private final MemberMapper memberMapper;

    @Override
    @Transactional(readOnly = true)
    public PagedResponseDTO<MemberResponseDTO> getMembers(MemberFilterRequestDTO filterRequest) {
        log.info("Getting members for event {} with filters", filterRequest.getEventId());
        
        // Build pageable
        Pageable pageable = buildPageable(filterRequest);
        
        // Get filtered members using composite key
        Page<EventAccountRole> memberPage = eventAccountRoleRepository.findByIdEventId(
                filterRequest.getEventId(), pageable);
        
        // Convert to DTOs
        List<MemberResponseDTO> memberDTOs = memberPage.getContent().stream()
                .map(memberMapper::toMemberResponseDTO)
                .collect(Collectors.toList());
        
        return PagedResponseDTO.<MemberResponseDTO>builder()
                .content(memberDTOs)
                .page(memberPage.getNumber())
                .size(memberPage.getSize())
                .totalElements(memberPage.getTotalElements())
                .totalPages(memberPage.getTotalPages())
                .first(memberPage.isFirst())
                .last(memberPage.isLast())
                .empty(memberPage.isEmpty())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MemberResponseDTO getMemberDetails(Integer eventId, Integer accountId) {
        log.info("Getting member details for event {} and account {}", eventId, accountId);
        
        EventAccountRole memberRole = findEventAccountRole(eventId, accountId);
        return memberMapper.toMemberResponseDTO(memberRole);
    }

    @Override
    public MemberResponseDTO updateMember(UpdateMemberRequestDTO request) {
        log.info("Updating member {} in event {}", request.getAccountId(), request.getEventId());
        
        // Find existing member role
        EventAccountRole memberRole = findEventAccountRole(request.getEventId(), request.getAccountId());
        
        // Update role if provided
        if (request.getEventRole() != null) {
            memberRole.setEventRole(EventAccountRole.EventRole.valueOf(request.getEventRole()));
        }
        
        // Update department if provided (simplified - no validation for now)
        if (request.getDepartmentId() != null) {
            // For simplicity, we'll handle department update later when needed
            log.info("Department update requested but not implemented yet");
        }
        
        EventAccountRole updated = eventAccountRoleRepository.save(memberRole);
        log.info("Successfully updated member {} in event {}", request.getAccountId(), request.getEventId());
        
        return memberMapper.toMemberResponseDTO(updated);
    }

    @Override
    public MemberResponseDTO banMember(BanMemberRequestDTO request) {
        log.info("Banning/unbanning member {} in event {}", request.getAccountId(), request.getEventId());
        
        // Find existing member role
        EventAccountRole memberRole = findEventAccountRole(request.getEventId(), request.getAccountId());
        
        // Update active status
        memberRole.setIsActive(!request.getIsBanned());
        
        EventAccountRole updated = eventAccountRoleRepository.save(memberRole);
        log.info("Successfully {} member {} in event {}", 
                request.getIsBanned() ? "banned" : "unbanned", 
                request.getAccountId(), request.getEventId());
        
        return memberMapper.toMemberResponseDTO(updated);
    }

    // Private helper methods
    private EventAccountRole findEventAccountRole(Integer eventId, Integer accountId) {
        EventAccountRoleId roleId = new EventAccountRoleId(eventId, accountId);
        return eventAccountRoleRepository.findById(roleId)
                .orElseThrow(() -> new MemberNotFoundException(eventId, accountId));
    }

    private Pageable buildPageable(MemberFilterRequestDTO filterRequest) {
        Sort.Direction direction = "desc".equalsIgnoreCase(filterRequest.getSortDirection()) 
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, mapSortField(filterRequest.getSortBy()));
        return PageRequest.of(filterRequest.getPage(), filterRequest.getSize(), sort);
    }

    private String mapSortField(String sortBy) {
        return switch (sortBy) {
            case "fullName" -> "createdAt"; // Can't sort by account fullName without join
            case "eventRole" -> "eventRole";
            case "departmentName" -> "createdAt"; // Can't sort by department name without join
            case "createdAt" -> "createdAt";
            default -> "createdAt";
        };
    }
}

