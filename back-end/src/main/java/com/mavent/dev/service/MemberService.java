package com.mavent.dev.service;

import com.mavent.dev.dto.member.*;

import java.util.List;

/**
 * Service interface for member management operations.
 * Simplified version for frontend integration - no authentication logic.
 */
public interface MemberService {

    /**
     * Get all members by event ID
     */
    List<MemberResponseDTO> getAllMembersByEventId(Integer eventId);

    /*
        Get all staff by event ID (Members, department managers, admin)
    */
    List<MemberResponseDTO> getAllStaffsByEventId(Integer eventId);


    /**
     * Get member details by event and account ID.
     */
    MemberResponseDTO getMemberDetails(Integer eventId, Integer accountId);

    /**
     * Update member role and department.
     */
    MemberResponseDTO updateMember(UpdateMemberRequestDTO request);

    /**
     * Ban or unban a member.
     */
    MemberResponseDTO banMember(BanMemberRequestDTO request);


    List<MemberDTO> getSponsorManageable(Integer eventId);
}
