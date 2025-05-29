package com.mavent.dev.controller;

import com.mavent.dev.dto.common.ApiResponseDTO;
import com.mavent.dev.dto.common.PagedResponseDTO;
import com.mavent.dev.dto.member.*;
import com.mavent.dev.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


/**
 * REST Controller for member management operations.
 * Handles HTTP requests for event member management.
 */
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    
    private static final Logger log = LoggerFactory.getLogger(MemberController.class);
    private final MemberService memberService;

    /**
     * Get paginated and filtered list of members for an event.
     *
     * @param eventId Event ID
     * @param search Search term (optional)
     * @param role Filter by role (optional)
     * @param department Filter by department (optional)
     * @param status Filter by status (optional)
     * @param page Page number (default: 0)
     * @param size Page size (default: 10)
     * @return Paginated list of members
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<PagedResponseDTO<MemberResponseDTO>>> getMembers(
            @RequestParam Integer eventId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            log.info("Getting members for event: {}, page: {}, size: {}", eventId, page, size);
            log.info("Search: {}, Role: {}, Department: {}, Status: {}", search, role, department, status);

            MemberFilterRequestDTO filterRequest = MemberFilterRequestDTO.builder()
                    .eventId(eventId)
                    .searchTerm(search)
                    .eventRole(role)
                    .departmentName(department) // Use department name instead of parsing as ID
                    .isActive(status != null ? "active".equalsIgnoreCase(status) : null)
                    .page(page)
                    .size(size)
                    .build();

            log.info("Filter request created: {}", filterRequest);

            PagedResponseDTO<MemberResponseDTO> members = memberService.getMembers(filterRequest);

            log.info("Members retrieved successfully. Count: {}", members != null ? members.getContent().size() : 0);

            ApiResponseDTO<PagedResponseDTO<MemberResponseDTO>> response = ApiResponseDTO.<PagedResponseDTO<MemberResponseDTO>>builder()
                    .success(true)
                    .message("Members retrieved successfully")
                    .data(members)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting members for event: {}", eventId, e);
            
            ApiResponseDTO<PagedResponseDTO<MemberResponseDTO>> errorResponse = ApiResponseDTO.<PagedResponseDTO<MemberResponseDTO>>builder()
                    .success(false)
                    .message("Error retrieving members: " + e.getMessage())
                    .data(null)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get member details by event and account ID.
     *
     * @param eventId Event ID
     * @param accountId Account ID
     * @return Member details
     */
    @GetMapping("/{eventId}/{accountId}")
    public ResponseEntity<ApiResponseDTO<MemberResponseDTO>> getMemberDetails(
            @PathVariable Integer eventId,
            @PathVariable Integer accountId) {

        log.info("Getting member details for event: {}, account: {}", eventId, accountId);

        MemberResponseDTO member = memberService.getMemberDetails(eventId, accountId);

        ApiResponseDTO<MemberResponseDTO> response = ApiResponseDTO.<MemberResponseDTO>builder()
                .success(true)
                .message("Member details retrieved successfully")
                .data(member)
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.ok(response);
    }


    /**
     * Update member role and department.
     *
     * @param request Update member request
     * @return Updated member details
     */
    @PutMapping
    public ResponseEntity<ApiResponseDTO<MemberResponseDTO>> updateMember(
            @Valid @RequestBody UpdateMemberRequestDTO request) {

        log.info("Updating member for event: {}, account: {}",
                request.getEventId(), request.getAccountId());

        MemberResponseDTO member = memberService.updateMember(request);

        ApiResponseDTO<MemberResponseDTO> response = ApiResponseDTO.<MemberResponseDTO>builder()
                .success(true)
                .message("Member updated successfully")
                .data(member)
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Ban or unban a member.
     *
     * @param request Ban member request
     * @return Updated member details
     */
    @PatchMapping("/ban")
    public ResponseEntity<ApiResponseDTO<MemberResponseDTO>> banMember(
            @Valid @RequestBody BanMemberRequestDTO request) {

        log.info("Banning/unbanning member for event: {}, account: {}, banned: {}",
                request.getEventId(), request.getAccountId(), request.getIsBanned());

        MemberResponseDTO member = memberService.banMember(request);

        String message = request.getIsBanned() ? "Member banned successfully" : "Member unbanned successfully";
        ApiResponseDTO<MemberResponseDTO> response = ApiResponseDTO.<MemberResponseDTO>builder()
                .success(true)
                .message(message)
                .data(member)
                .timestamp(LocalDateTime.now().toString())
                .build();

        return ResponseEntity.ok(response);
    }

}
