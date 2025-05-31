package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventImplement implements EventService {

    @Autowired
    private EventRepository eventRepository;

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
