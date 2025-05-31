package com.mavent.dev.service.implement;

import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.EventAccountRoleId;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.service.EventAccountRoleService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventAccountRoleServiceImpl implements EventAccountRoleService {

    private final EventAccountRoleRepository eventAccountRoleRepository;

    public EventAccountRoleServiceImpl(EventAccountRoleRepository eventAccountRoleRepository) {
        this.eventAccountRoleRepository = eventAccountRoleRepository;
    }

    @Override
    public List<EventAccountRole> getMembersByEventId(Integer eventId) {
        return eventAccountRoleRepository.findByIdEventId(eventId);
    }

    @Override
    public Page<EventAccountRole> getMembersByEventIdWithPagination(Integer eventId, Pageable pageable) {
        return eventAccountRoleRepository.findByIdEventId(eventId, pageable);
    }

    @Override
    public List<EventAccountRole> getMembersByAccountId(Integer accountId) {
        return eventAccountRoleRepository.findByIdAccountId(accountId);
    }

    @Override
    public Page<EventAccountRole> searchMembersInEvent(Integer eventId, String searchTerm, Pageable pageable) {
        return eventAccountRoleRepository.findByEventIdWithSearch(eventId, searchTerm, pageable);
    }

    @Override
    public List<EventAccountRole> getMembersByEventIdAndRole(Integer eventId, EventAccountRole.EventRole role) {
        return eventAccountRoleRepository.findByIdEventIdAndEventRole(eventId, role);
    }

    @Override
    public List<EventAccountRole> getActiveMembersByEventId(Integer eventId) {
        return eventAccountRoleRepository.findByIdEventIdAndIsActive(eventId, true);
    }

    @Override
    public EventAccountRole addMemberToEvent(EventAccountRole eventAccountRole) {
        return eventAccountRoleRepository.save(eventAccountRole);
    }

    @Override
    public EventAccountRole updateMemberRole(EventAccountRoleId id, EventAccountRole updatedRole) {
        Optional<EventAccountRole> existingRole = eventAccountRoleRepository.findById(id);
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
    public boolean removeMemberFromEvent(EventAccountRoleId id) {
        if (eventAccountRoleRepository.existsById(id)) {
            eventAccountRoleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public boolean activateDeactivateMember(EventAccountRoleId id, boolean isActive) {
        Optional<EventAccountRole> member = eventAccountRoleRepository.findById(id);
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
        return eventAccountRoleRepository.findByIdEventId(eventId).size();
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
        return eventAccountRoleRepository.existsByIdEventIdAndIdAccountId(eventId, accountId);
    }

    @Override
    public boolean hasRoleInEvent(Integer eventId, Integer accountId, EventAccountRole.EventRole role) {
        return eventAccountRoleRepository.hasRoleInEvent(eventId, accountId, role);
    }

    @Override
    public boolean isOrganizerOfEvent(Integer eventId, Integer accountId) {
        return eventAccountRoleRepository.isOrganizerOfEvent(eventId, accountId);
    }

    @Override
    public boolean isParticipantInEvent(Integer eventId, Integer accountId) {
        return eventAccountRoleRepository.isParticipantInEvent(eventId, accountId);
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
