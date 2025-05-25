package com.mavent.dev.service;

import com.mavent.dev.dto.member.*;
import com.mavent.dev.dto.common.PagedResponseDTO;

/**
 * Service interface for member management operations.
 * Simplified version for frontend integration - no authentication logic.
 */
public interface MemberService {

    /**
     * Get paginated and filtered list of members for an event.
     */
    PagedResponseDTO<MemberResponseDTO> getMembers(MemberFilterRequestDTO filterRequest);

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
}
