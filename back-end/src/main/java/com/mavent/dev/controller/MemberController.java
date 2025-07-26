package com.mavent.dev.controller;

import com.mavent.dev.dto.account.AccountDTO;
import com.mavent.dev.dto.member.*;
import com.mavent.dev.entity.Account;
import com.mavent.dev.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing event members.
 * Refactored to follow RESTful conventions.
 */
@RestController
@RequestMapping("/api/events/{eventId}/members")
@RequiredArgsConstructor
public class MemberController {


    private final MemberService memberService;

    /**
     * Get all members for an event.
     * Frontend handles filtering, sorting, and pagination.
     *
     * @param eventId ID of the event
     * @return List of all members for the event
     */
    @GetMapping
    public ResponseEntity<List<MemberResponseDTO>> getEventMembers(
            @PathVariable Integer eventId) {
        // get all event-attended accounts (including PARTICIPANTS)
        List<MemberResponseDTO> members = memberService.getAllMembersByEventId(eventId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/staffs")
    public ResponseEntity<List<MemberResponseDTO>> getStaffMembers(@PathVariable Integer eventId) {
        // get all staffs of event (MEMBERS, DEPARTMENT_MANAGER, ADMIN)
        List<MemberResponseDTO> staffs = memberService.getAllStaffsByEventId(eventId);
        return ResponseEntity.ok(staffs);
    }


    @GetMapping("/manage-sponsor")
    public ResponseEntity<List<MemberDTO>> getSponsorManageable(@PathVariable Integer eventId){
        return ResponseEntity.ok(memberService.getSponsorManageable(eventId));
    }

    /**
     * Get details for a specific member of an event.
     *
     * @param eventId Event ID
     * @param accountId Account ID
     * @return Member details
     */
    @GetMapping("/{accountId}")
    public ResponseEntity<MemberResponseDTO> getMemberDetails(
            @PathVariable Integer eventId,
            @PathVariable Integer accountId) {
        MemberResponseDTO member = memberService.getMemberDetails(eventId, accountId);
        return ResponseEntity.ok(member);
    }


    /**
     * Update a member's role and/or department (partial update).
     *
     * @param eventId Event ID
     * @param accountId Account ID
     * @param request Update request with new role/department info
     * @return Updated member details
     */
    @PostMapping("/{accountId}")
    public ResponseEntity<MemberResponseDTO> updateMember(
            @PathVariable Integer eventId,
            @PathVariable Integer accountId,
            @RequestBody @Valid UpdateMemberRequestDTO request) {
        
        // Set IDs từ path vào request
        request.setEventId(eventId);
        request.setAccountId(accountId);
        
        MemberResponseDTO updatedMember = memberService.updateMember(request);
        
        return ResponseEntity.ok(updatedMember);
    }

    /**
     * Ban/unban a member (partial update of ban status).
     *
     * @param eventId Event ID
     * @param accountId Account ID
     * @param request Ban request with ban status and reason
     * @return Updated member details
     */

    @PostMapping("/{accountId}/ban")
    public ResponseEntity<MemberResponseDTO> banMember(
            @PathVariable Integer eventId,
            @PathVariable Integer accountId,
            @RequestBody @Valid BanMemberRequestDTO request) {


        request.setEventId(eventId);
        request.setAccountId(accountId);
        
        // Bỏ qua validation cho eventId và accountId vì sẽ được set từ path
        MemberResponseDTO updatedMember = memberService.banMember(request);
        
        return ResponseEntity.ok(updatedMember);
    }

}
