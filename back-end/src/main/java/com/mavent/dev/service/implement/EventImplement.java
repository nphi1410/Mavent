package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.DTO.FilterEventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventImplement implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Page<FilterEventDTO> getFilterEvents(String name, String status, List<Integer> tagIds, String sortType, int page, int size) {
        Sort sort = switch (sortType) {
            case "START_DATE_ASC" -> Sort.by("start_datetime").ascending();
            case "START_DATE_DESC" -> Sort.by("start_datetime").descending();
            case "SCALE_ASC" -> Sort.by("max_participant_number").ascending();
            case "SCALE_DESC" -> Sort.by("max_participant_number").descending();
            case "RATING_ASC" -> Sort.by("avgRating").ascending();
            case "RATING_DESC" -> Sort.by("avgRating").descending();
            default -> Sort.unsorted();
        };

        Pageable pageable = PageRequest.of(page, size, sort);

        if (tagIds == null || tagIds.isEmpty()) {
            return eventRepository.findAllFilteredNoTags(name, status, pageable);
        }

        return eventRepository.findAllFiltered(name, status, tagIds, pageable);
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

    private Event getEventEntityById(Integer eventId){
        Event event = null;
        try {
            event = eventRepository.findByEventId(eventId);
        } catch (Exception e){
            System.err.println("Event not found with ID: " + eventId);
            System.err.println("Error: "+ e);
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
}
