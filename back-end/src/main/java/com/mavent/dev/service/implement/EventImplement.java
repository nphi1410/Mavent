package com.mavent.dev.service.implement;

import com.mavent.dev.dto.EventCountDTO;
import com.mavent.dev.dto.EventMemberDTO;
import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.event.*;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.Location;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.*;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventImplement implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AgendaService agendaService;
    @Autowired
    private TimelineService timelineService;
    @Autowired
    private ProposalService proposalService;
    @Autowired
    private LocationService locationService;

    // Thêm EventTagService để xử lý tags
    @Autowired
    private EventTagService eventTagService;

    @Override
    public Page<FilterEventDTO> getFilterEvents(String name, String status, List<Integer> tagIds, String sortType, int page, int size, String type, boolean isTrending) {
        Pageable pageable = PageRequest.of(page, size);
        boolean tagCheck = tagIds != null && !tagIds.isEmpty();
        return eventRepository.findAllUnified(name, status, type, tagCheck, tagIds, isTrending, sortType, pageable);
    }

    // Cập nhật method createEvent để nhận thêm parameter tagIds
    @Override
    @Transactional
    public EventDTO createEvent(EventDTO eventDTO, List<Integer> tagIds) {
        try {
            System.out.println("=== EventImplement.createEvent ===");
            System.out.println("Creating event: " + eventDTO.getName());
            System.out.println("TagIds: " + tagIds);

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
            event.setStatus(eventDTO.getStatus()); // Có thể null lúc tạo
            event.setBannerUrl(eventDTO.getBannerUrl());
            event.setPosterUrl(eventDTO.getPosterUrl());
            event.setCreatedBy(eventDTO.getCreatedBy());
            event.setIsDeleted(false);
            event.setCreatedAt(java.time.LocalDateTime.now());
            event.setUpdatedAt(java.time.LocalDateTime.now());

            System.out.println("Saving event to database...");
            Event savedEvent = eventRepository.save(event);
            System.out.println("Event saved with ID: " + savedEvent.getEventId());

            // Thêm logic lưu tags sau khi lưu event thành công
            if (tagIds != null && !tagIds.isEmpty()) {
                System.out.println("Saving event tags...");
                eventTagService.saveEventTags(savedEvent.getEventId(), tagIds);
                System.out.println("Event tags saved successfully");
            } else {
                System.out.println("No tags to save");
            }

            System.out.println("Event creation completed successfully");
            return mapToDTO(savedEvent);

        } catch (Exception e) {
            System.err.println("=== ERROR IN EventImplement.createEvent ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("===========================================");
            throw e; // Re-throw để controller bắt được
        }
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
        if (eventDTO.getBannerUrl() != null) event.setBannerUrl(eventDTO.getBannerUrl());
        if (eventDTO.getPosterUrl() != null) event.setPosterUrl(eventDTO.getPosterUrl());
        if (eventDTO.getCreatedBy() != null) event.setCreatedBy(eventDTO.getCreatedBy());
        if (eventDTO.getIsDeleted() != null) event.setIsDeleted(eventDTO.getIsDeleted());

        // Save entity
        Event updatedEvent = eventRepository.save(event);

        return mapToDTO(updatedEvent);
    }

    @Override
    public List<EventCountDTO> getMonthlyStatistic(String status) {
        return eventRepository.countByMonthWithoutStatus(status);
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
                event.getBannerUrl(),
                event.getPosterUrl(),
                event.getCreatedBy(),
                event.getIsDeleted(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }

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

    @Override
    public PendingEventDTO getPendingEventById(Integer eventId) {
//        return null;
        Event event = getEventEntityById(eventId);
        if (event == null) {
            return null; // Hoặc ném ngoại lệ nếu cần
        }

        PendingEventDTO pendingEventDTO = new PendingEventDTO();
        pendingEventDTO.setId(event.getEventId());
        pendingEventDTO.setName(event.getName());
        pendingEventDTO.setDescription(event.getDescription());
        pendingEventDTO.setStatus(event.getStatus() != null ? event.getStatus().name() : null);
        pendingEventDTO.setStartDate(event.getStartDatetime() != null ? event.getStartDatetime().toString() : null);
        pendingEventDTO.setEndDate(event.getEndDatetime() != null ? event.getEndDatetime().toString() : null);
        pendingEventDTO.setCreatedAt(event.getCreatedAt() != null ? event.getCreatedAt().toString() : null);
        pendingEventDTO.setUpdatedAt(event.getUpdatedAt() != null ? event.getUpdatedAt().toString() : null);
        pendingEventDTO.setBannerUrl(event.getBannerUrl());
        pendingEventDTO.setPosterUrl(event.getPosterUrl());
        pendingEventDTO.setLocation(event.getLocation());
        pendingEventDTO.setLocationId(event.getLocationId());
        pendingEventDTO.setDdayInfo(event.getDdayInfo());
        pendingEventDTO.setMaxMembers(event.getMaxMemberNumber());
        pendingEventDTO.setMaxParticipants(event.getMaxParticipantNumber());

        // Thêm thông tin người dùng tạo sự kiện
        try {
            Account creator = accountRepository.findById(event.getCreatedBy()).orElse(null);
            if (creator != null) {
                UserPendingEventDTO userPendingEventDTO = new UserPendingEventDTO();
                userPendingEventDTO.setId(creator.getAccountId());
                userPendingEventDTO.setUsername(creator.getUsername());
                userPendingEventDTO.setAvatarUrl(creator.getAvatarUrl());
                pendingEventDTO.setCreator(userPendingEventDTO);
            }
        } catch (Exception e) {
            System.err.println("Error fetching creator for event ID: " + eventId);
            System.err.println("Error: " + e.getMessage());
        }

        // Thêm thông tin đề xuất, agenda, timeline
        try {
            List<AgendaDTO> agendas = agendaService.getAgendaItemsByEventId(eventId);
            System.out.println("Event ID: " + eventId);
            List<TimelineDTO> timelines = timelineService.getTimelineItemsByEventId(eventId);

            if (timelines != null) {
                pendingEventDTO.setTimelines(timelines);
            }

            if (agendas != null) {
                pendingEventDTO.setAgendas(agendas);
            }
        } catch (Exception e) {
            System.err.println("Error fetching agendas or timelines for event ID: " + eventId);
            System.err.println("Error: " + e.getMessage());
        }

        try {
            ProposalDTO proposalDTO = proposalService.getProposalByEventId(eventId);
            if (proposalDTO != null) {
                pendingEventDTO.setProposal(proposalDTO);
            }
        } catch (Exception e) {
            System.err.println("Error fetching proposal for event ID: " + eventId);
            System.err.println("Error: " + e.getMessage());
        }

        try {
            Location location = locationService.getLocationById(event.getLocationId());
            if (location != null) {
                pendingEventDTO.setLocation(location.getLocationName());
            } else {
                pendingEventDTO.setLocation("Unknown Location");
            }
        } catch (Exception e) {
            System.err.println("Error fetching location for event ID: " + eventId);
            System.err.println("Error: " + e.getMessage());
            pendingEventDTO.setLocation("Unknown Location");
        }
        return pendingEventDTO;
    }

    @Override
    public boolean updatePendingEvent(Integer eventId, String status) {
        Event event = getEventEntityById(eventId);
        if (event == null) {
            return false; // Hoặc ném ngoại lệ nếu cần
        }

        // Cập nhật trạng thái sự kiện
        try {
            event.setStatus(Event.EventStatus.valueOf(status.toUpperCase()));
            System.out.println("event status updated to: " + event.getStatus());
            eventRepository.save(event);
            return true;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid status value: " + status);
            return false; // Trả về false nếu trạng thái không hợp lệ
        }
    }

    @Override
    public List<EventDTO> getEventByCreatorId(Integer creatorId) {
        List<Event> events = eventRepository.findByCreatedBy(creatorId);
        return events.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}