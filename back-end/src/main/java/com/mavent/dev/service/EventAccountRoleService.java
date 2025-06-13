package com.mavent.dev.service;

import com.mavent.dev.entity.EventAccountRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventAccountRoleService {
    // Quản lý members trong event
    List<EventAccountRole> getMembersByEventId(Integer eventId);

    Page<EventAccountRole> getMembersByEventIdWithPagination(Integer eventId, Pageable pageable);

    List<EventAccountRole> getMembersByAccountId(Integer accountId);

    // Tìm kiếm và lọc members
    Page<EventAccountRole> searchMembersInEvent(Integer eventId, String searchTerm, Pageable pageable);

    List<EventAccountRole> getMembersByEventIdAndRole(Integer eventId, EventAccountRole.EventRole role);

    List<EventAccountRole> getActiveMembersByEventId(Integer eventId);

    // Quản lý thành viên
    EventAccountRole addMemberToEvent(EventAccountRole eventAccountRole);

    EventAccountRole updateMemberRole(EventAccountRole updatedRole);

    boolean removeMemberFromEvent(EventAccountRole eventAccountRole);

    boolean activateDeactivateMember(EventAccountRole eventAccountRole, boolean isActive);

    // Thống kê
    long countMembersByEventId(Integer eventId);

    long countMembersByRole(Integer eventId, EventAccountRole.EventRole role);

    long countActiveMembersByEventId(Integer eventId);

    // Kiểm tra quyền
    boolean isMemberInEvent(Integer eventId, Integer accountId);

    boolean hasRoleInEvent(Integer eventId, Integer accountId, EventAccountRole.EventRole role);

    boolean isOrganizerOfEvent(Integer eventId, Integer accountId);

    boolean isParticipantInEvent(Integer eventId, Integer accountId);

    // Lấy member với filters
    Page<EventAccountRole> getMembersWithFilters(Integer eventId, Boolean isActive,
                                                 EventAccountRole.EventRole role,
                                                 Integer departmentId,
                                                 String searchTerm,
                                                 java.util.Date startDate,
                                                 java.util.Date endDate,
                                                 Pageable pageable);
}
