package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.EventAccountRoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventAccountRoleServiceImpl implements EventAccountRoleService {

    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;

    @Override
    public List<EventAccountRole> getMembersByEventId(Integer eventId) {
        return eventAccountRoleRepository.findByEventId(eventId);
    }

    @Override
    public Page<EventAccountRole> getMembersByEventIdWithPagination(Integer eventId, Pageable pageable) {
        return eventAccountRoleRepository.findByEventId(eventId, pageable);
    }

    @Override
    public List<EventAccountRole> getMembersByAccountId(Integer accountId) {
        return eventAccountRoleRepository.findByAccountId(accountId);
    }

    @Override
    public Page<EventAccountRoleDTO> getMembersByAccountIdWithPagination(Integer accountId, Pageable pageable) {
        return eventAccountRoleRepository.findByAccountId(accountId,pageable);
    }

    @Override
    public Page<EventAccountRole> searchMembersInEvent(Integer eventId, String searchTerm, Pageable pageable) {
        return eventAccountRoleRepository.findByEventIdWithSearch(eventId, searchTerm, pageable);
    }

    @Override
    public List<EventAccountRole> getMembersByEventIdAndRole(Integer eventId, EventAccountRole.EventRole role) {
        return eventAccountRoleRepository.findByEventIdAndEventRole(eventId, role);
    }

    @Override
    public List<EventAccountRole> getActiveMembersByEventId(Integer eventId) {
        return eventAccountRoleRepository.findByEventIdAndIsActive(eventId, true);
    }

    @Override
    public EventAccountRole addMemberToEvent(EventAccountRole eventAccountRole) {
        return eventAccountRoleRepository.save(eventAccountRole);
    }

    @Override
    public EventAccountRole updateMemberRole(EventAccountRole updatedRole) {
        Optional<EventAccountRole> existingRole = eventAccountRoleRepository.findByEventIdAndAccountId(updatedRole.getEventId(), updatedRole.getAccountId());
        if (existingRole.isPresent()) {
            EventAccountRole roleToUpdate = existingRole.get();
            roleToUpdate.setEventRole(updatedRole.getEventRole());
            roleToUpdate.setDepartmentId(updatedRole.getDepartmentId());
            roleToUpdate.setIsActive(updatedRole.getIsActive());
            return eventAccountRoleRepository.save(roleToUpdate);
        }
        return null;
    }

    @Override
    public boolean removeMemberFromEvent(EventAccountRole eventAccountRole) {
        Optional<EventAccountRole> member = eventAccountRoleRepository.findByEventIdAndAccountId(eventAccountRole.getEventId(), eventAccountRole.getAccountId());
        if (member.isPresent()) {
            eventAccountRoleRepository.delete(member.get());
            return true;
        }
        return false;
    }

    @Override
    public boolean activateDeactivateMember(EventAccountRole eventAccountRole, boolean isActive) {
        Optional<EventAccountRole> member = eventAccountRoleRepository.findByEventIdAndAccountId(eventAccountRole.getEventId(), eventAccountRole.getAccountId());
        if (member.isPresent()) {
            EventAccountRole memberToUpdate = member.get();
            memberToUpdate.setIsActive(isActive);
            eventAccountRoleRepository.save(memberToUpdate);
            return true;
        }
        return false;
    }

    @Override
    public long countMembersByEventId(Integer eventId) {
        return eventAccountRoleRepository.findByEventId(eventId).size();
    }

    @Override
    public long countMembersByRole(Integer eventId, EventAccountRole.EventRole role) {
        return eventAccountRoleRepository.countByEventIdAndRole(eventId, role);
    }

    @Override
    public long countActiveMembersByEventId(Integer eventId) {
        return eventAccountRoleRepository.countByEventIdAndActiveStatus(eventId, true);
    }

    @Override
    public boolean isMemberInEvent(Integer eventId, Integer accountId) {
        return eventAccountRoleRepository.existsByEventIdAndAccountId(eventId, accountId);
    }

    @Override
    public boolean hasRoleInEvent(Integer eventId, Integer accountId, EventAccountRole.EventRole role) {
        return eventAccountRoleRepository.hasRoleInEvent(eventId, accountId, role);
    }

    @Override
    public Page<EventAccountRole> getMembersWithFilters(Integer eventId, Boolean isActive,
                                                        EventAccountRole.EventRole role,
                                                        Integer departmentId,
                                                        String searchTerm,
                                                        java.util.Date startDate,
                                                        java.util.Date endDate,
                                                        Pageable pageable) {
        return eventAccountRoleRepository.findByEventIdWithFilters(eventId, isActive, role, departmentId, searchTerm, startDate, endDate, pageable);
    }
}
