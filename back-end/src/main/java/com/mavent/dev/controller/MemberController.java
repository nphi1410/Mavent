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
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            log.info("Getting members for event: {}, page: {}, size: {}", eventId, page, size);
            log.info("Search: {}, Role: {}, Department: {}, Status: {}", search, role, department, status);
            log.info("Date range: {} to {}", startDate, endDate);
            
            // Log date params in detail for debugging
            if (startDate != null && !startDate.trim().isEmpty()) {
                log.info("Start date parameter is present: {}", startDate);
                try {
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date parsedDate = sdf.parse(startDate);
                    log.info("Start date parsed successfully: {}", sdf.format(parsedDate));
                } catch (Exception e) {
                    log.warn("Could not parse start date: {}", e.getMessage());
                }
            }
            
            if (endDate != null && !endDate.trim().isEmpty()) {
                log.info("End date parameter is present: {}", endDate);
                try {
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date parsedDate = sdf.parse(endDate);
                    log.info("End date parsed successfully: {}", sdf.format(parsedDate));
                } catch (Exception e) {
                    log.warn("Could not parse end date: {}", e.getMessage());
                }
            }

            // Convert department to Integer if it's numeric
            Integer departmentId = null;
            if (department != null && !department.trim().isEmpty()) {
                try {
                    if (department.matches("\\d+")) {
                        departmentId = Integer.parseInt(department);
                        log.info("Parsed department parameter as numeric ID: {}", departmentId);
                        // Check if it's 0, set to null (this helps with our repository query)
                        if (departmentId == 0) {
                            departmentId = null;
                            log.info("Department ID was 0, setting to null");
                        }
                    } else {
                        log.info("Department parameter is not numeric: {}", department);
                    }
                } catch (NumberFormatException e) {
                    log.warn("Could not parse department as integer: {}", department);
                }
            }
            
            MemberFilterRequestDTO filterRequest = MemberFilterRequestDTO.builder()
                    .eventId(eventId)
                    .searchTerm(search)
                    .eventRole(role != null ? role.trim() : null)  // Trim role to avoid whitespace issues
                    .departmentId(departmentId)  // Set department ID if parsed successfully
                    .departmentName(department) // Also keep department name for fallback
                    .status(status) // Send raw status string
                    .isActive(status != null ? "active".equalsIgnoreCase(status.trim()) : null) // Also set isActive for backward compatibility
                    .startDate(startDate)  // Add start date
                    .endDate(endDate)      // Add end date
                    .page(page)
                    .size(size)
                    .build();
                    
            log.debug("Filter request with department info - id: {}, name: {}", 
                     filterRequest.getDepartmentId(),
                     filterRequest.getDepartmentName());
                    
            log.debug("Status parameter: {}, converted to isActive: {}", 
                     status, 
                     status != null ? "active".equalsIgnoreCase(status.trim()) : null);

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

        log.info("Updating member for event: {}, account: {}, role: {}, isActive: {}",
                request.getEventId(), request.getAccountId(), request.getEventRole(), request.getIsActive());

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
