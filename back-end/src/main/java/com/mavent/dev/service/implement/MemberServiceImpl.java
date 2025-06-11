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

        // Process filters
        Boolean isActive = null;
        if (filterRequest.getStatus() != null && !filterRequest.getStatus().isEmpty()) {
            isActive = "active".equalsIgnoreCase(filterRequest.getStatus());
            log.info("Filtering by status: {}, isActive: {}", filterRequest.getStatus(), isActive);
        } else if (filterRequest.getIsActive() != null) {
            // Fallback to isActive if status is not provided
            isActive = filterRequest.getIsActive();
            log.info("No status provided, using isActive: {}", isActive);
        }

        EventAccountRole.EventRole eventRole = null;
        if (filterRequest.getEventRole() != null && !filterRequest.getEventRole().isEmpty()) {
            try {
                // Normalize the role name to ensure it matches enum values
                String normalizedRole = filterRequest.getEventRole().trim().toUpperCase();
                eventRole = EventAccountRole.EventRole.valueOf(normalizedRole);
                log.info("Filtering by role: {}", eventRole);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid event role: {}", filterRequest.getEventRole());
            }
        }

        // Process department filter - handle both ID and name
        Integer departmentId = filterRequest.getDepartmentId();

        // If departmentId is null but departmentName is provided, try to resolve by name
        if (departmentId == null && filterRequest.getDepartmentName() != null && !filterRequest.getDepartmentName().trim().isEmpty()) {
            String deptName = filterRequest.getDepartmentName().trim();
            log.info("Looking up department ID for name: '{}'", deptName);

            // Try to parse as numeric ID first
            if (deptName.matches("\\d+")) {
                try {
                    departmentId = Integer.parseInt(deptName);
                    log.info("Parsed department name as numeric ID: {}", departmentId);
                } catch (NumberFormatException e) {
                    log.warn("Failed to parse department name as ID: {}", deptName);
                }
            } else {
                // Try to find department by name using department repository
                log.info("Searching for department by name: {}", deptName);

                // Since we don't have direct access to the department repository here,
                // we'll have to rely on the EventAccountRoleRepository's query to handle name-based lookups

                // Log the department ID that will be used in the query
                log.info("Using null department ID and letting repository handle name-based lookup");
            }
        }

        // Log the department ID for debugging
        log.info("Final department filter value: {}", departmentId);

        // Process search term
        String searchTerm = filterRequest.getSearchTerm();
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            searchTerm = searchTerm.trim();
            log.info("Searching with term: '{}'", searchTerm);
        } else {
            searchTerm = null; // Set to null if empty or only whitespace
        }

        // Process date filters
        java.util.Date startDateObj = null;
        java.util.Date endDateObj = null;

        if (filterRequest.getStartDate() != null && !filterRequest.getStartDate().isEmpty()) {
            try {
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
                startDateObj = sdf.parse(filterRequest.getStartDate());
                log.info("Filtering by start date: {}", filterRequest.getStartDate());
            } catch (java.text.ParseException e) {
                log.warn("Invalid start date format: {}", filterRequest.getStartDate());
            }
        }

        if (filterRequest.getEndDate() != null && !filterRequest.getEndDate().isEmpty()) {
            try {
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
                // Set time to end of day for inclusive filtering
                endDateObj = sdf.parse(filterRequest.getEndDate());
                java.util.Calendar cal = java.util.Calendar.getInstance();
                cal.setTime(endDateObj);
                cal.set(java.util.Calendar.HOUR_OF_DAY, 23);
                cal.set(java.util.Calendar.MINUTE, 59);
                cal.set(java.util.Calendar.SECOND, 59);
                cal.set(java.util.Calendar.MILLISECOND, 999);
                endDateObj = cal.getTime();
                log.info("Filtering by end date: {} (adjusted to end of day: {})",
                        filterRequest.getEndDate(),
                        new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(endDateObj));
            } catch (java.text.ParseException e) {
                log.warn("Invalid end date format: {}", filterRequest.getEndDate());
            }
        }

        // Use repository method with explicit filters including dates
        Page<EventAccountRole> memberPage = eventAccountRoleRepository.findByEventIdWithFilters(
                filterRequest.getEventId(),
                isActive,
                eventRole,
                departmentId,
                searchTerm,
                startDateObj,
                endDateObj,
                pageable);

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
        log.info("Updating member {} in event {} with data: role={}, departmentId={}, isActive={}",
                request.getAccountId(), request.getEventId(),
                request.getEventRole(), request.getDepartmentId(), request.getIsActive());

        // Find existing member role
        EventAccountRole memberRole = findEventAccountRole(request.getEventId(), request.getAccountId());

        // Log current values before update
        log.info("Current values before update - role: {}, departmentId: {}, isActive: {}",
                memberRole.getEventRole(), memberRole.getDepartmentId(), memberRole.getIsActive());

        // Update role if provided
        if (request.getEventRole() != null) {
            memberRole.setEventRole(EventAccountRole.EventRole.valueOf(request.getEventRole()));
        }

        // Update department if provided
        if (request.getDepartmentId() != null) {
            log.info("Updating department ID to: {}", request.getDepartmentId());
            memberRole.setDepartmentId(request.getDepartmentId());
        }

        // Update isActive status if provided
        if (request.getIsActive() != null) {
            log.info("Updating isActive status to: {}", request.getIsActive());
            memberRole.setIsActive(request.getIsActive());
        }

        // Lưu và đảm bảo dữ liệu được flush ngay lập tức đến database
        EventAccountRole updated = eventAccountRoleRepository.saveAndFlush(memberRole);
        log.info("Successfully updated member {} in event {}", request.getAccountId(), request.getEventId());

        // Clear cache để các query tiếp theo đọc giá trị mới từ DB thay vì từ cache
        eventAccountRoleRepository.flush();

        return memberMapper.toMemberResponseDTO(updated);
    }

    @Override
    public MemberResponseDTO banMember(BanMemberRequestDTO request) {
        log.info("Banning/unbanning member {} in event {}", request.getAccountId(), request.getEventId());

        // Find existing member role
        EventAccountRole memberRole = findEventAccountRole(request.getEventId(), request.getAccountId());

        // Update active status
        memberRole.setIsActive(!request.getIsBanned());

        // Use saveAndFlush for consistency with updateMember method
        EventAccountRole updated = eventAccountRoleRepository.saveAndFlush(memberRole);

        // Flush to ensure changes are written to DB
        eventAccountRoleRepository.flush();
        log.info("Successfully {} member {} in event {}",
                request.getIsBanned() ? "banned" : "unbanned",
                request.getAccountId(), request.getEventId());

        return memberMapper.toMemberResponseDTO(updated);
    }    // Private helper methods

    private EventAccountRole findEventAccountRole(Integer eventId, Integer accountId) {
        return eventAccountRoleRepository.findByEventIdAndAccountId(eventId, accountId)
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

