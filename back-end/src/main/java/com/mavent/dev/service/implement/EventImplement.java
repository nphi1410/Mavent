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
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
        return mapToDTO(event);
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
