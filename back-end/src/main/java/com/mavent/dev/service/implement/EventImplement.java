package com.mavent.dev.service.implement;

import com.mavent.dev.dto.EventMemberDTO;
import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.EventService;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventImplement implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Page<FilterEventDTO> getFilterEvents(String name, String status, List<Integer> tagIds, String sortType, int page, int size, String type, boolean isTrending) {
        Pageable pageable = PageRequest.of(page, size);
        boolean tagCheck = tagIds != null && !tagIds.isEmpty();
        return eventRepository.findAllUnified(name, status, type, tagCheck, tagIds, isTrending, sortType, pageable);
    }

    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = new Event();

        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setStartDatetime(eventDTO.getStartDatetime());
        event.setEndDatetime(eventDTO.getEndDatetime());
        event.setLocation(eventDTO.getLocation());
        event.setLocationId(eventDTO.getLocationId());
        event.setDdayInfo(eventDTO.getDdayInfo());
        event.setMaxMemberNumber(eventDTO.getMaxMemberNumber());
        event.setMaxParticipantNumber(eventDTO.getMaxParticipantNumber());
        event.setStatus(eventDTO.getStatus());
        event.setCreatedBy(eventDTO.getCreatedBy());
        event.setIsDeleted(false); // Khi tạo mặc định là chưa xoá
        event.setCreatedAt(java.time.LocalDateTime.now());
        event.setUpdatedAt(java.time.LocalDateTime.now());

        // Lưu vào db
        Event savedEvent = eventRepository.save(event);

        return mapToDTO(savedEvent);
    }


    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventDTO getEventById(Integer eventId) {
        Event event = getEventEntityById(eventId);
        return mapToDTO(event);
    }

    @Override
    public EventDTO updateEvent(Integer eventId, EventDTO eventDTO) {
        Event event = getEventEntityById(eventId);

        // cập nhật từng trường khi eventDTO không null
        if (eventDTO.getName() != null) event.setName(eventDTO.getName());
        if (eventDTO.getDescription() != null) event.setDescription(eventDTO.getDescription());
        if (eventDTO.getStartDatetime() != null) event.setStartDatetime(eventDTO.getStartDatetime());
        if (eventDTO.getEndDatetime() != null) event.setEndDatetime(eventDTO.getEndDatetime());
        if (eventDTO.getLocation() != null) event.setLocation(eventDTO.getLocation());
        if (eventDTO.getDdayInfo() != null) event.setDdayInfo(eventDTO.getDdayInfo());
        if (eventDTO.getMaxMemberNumber() != null) event.setMaxMemberNumber(eventDTO.getMaxMemberNumber());
        if (eventDTO.getMaxParticipantNumber() != null)
            event.setMaxParticipantNumber(eventDTO.getMaxParticipantNumber());
        if (eventDTO.getStatus() != null) event.setStatus(eventDTO.getStatus());
        if (eventDTO.getCreatedBy() != null) event.setCreatedBy(eventDTO.getCreatedBy());
        if (eventDTO.getIsDeleted() != null) event.setIsDeleted(eventDTO.getIsDeleted());

        // Save entity
        Event updatedEvent = eventRepository.save(event);

        return mapToDTO(updatedEvent);
    }

    @Override
    public Page<T> getEventByDateRange(String type, Boolean isTrending) {
        return null;
    }

    @Override
    public Event getEventEntityById(Integer eventId) {
        Event event = null;
        try {
            event = eventRepository.findByEventId(eventId);
        } catch (Exception e) {
            System.err.println("Event not found with ID: " + eventId);
            System.err.println("Error: " + e);
        }

        return event;
    }

    private EventDTO mapToDTO(Event event) {
        return new EventDTO(
                event.getEventId(),
                event.getName(),
                event.getDescription(),
                event.getStartDatetime(),
                event.getEndDatetime(),
                event.getLocation(),
                event.getLocationId(),
                event.getDdayInfo(),
                event.getMaxMemberNumber(),
                event.getMaxParticipantNumber(),
                event.getStatus(),
                event.getCreatedBy(),
                event.getIsDeleted(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }

    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public boolean checkEventAccess(Integer eventId, Integer accountId) {
        Optional<EventAccountRole> role = eventAccountRoleRepository.findByEventIdAndAccountId(eventId, accountId);
        return role.isPresent() && role.get().getIsActive();
    }

    @Override
    public List<EventMemberDTO> getEventMembers(Integer eventId) {
        List<EventAccountRole> members = eventAccountRoleRepository.findByEventId(eventId);

        return members.stream()
            .map(member -> {
                EventMemberDTO dto = new EventMemberDTO();
                Account account = accountRepository.findById(member.getAccountId()).orElse(null);
                if (account != null) {
                    dto.setAccountId(account.getAccountId());
                    dto.setFullName(account.getFullName());
                    dto.setEmail(account.getEmail());
                    dto.setAvatarUrl(account.getAvatarUrl());
                }
                dto.setRole(member.getEventRole().name());
                dto.setIsActive(member.getIsActive());
                return dto;
            })
            .collect(Collectors.toList());
    }
}
