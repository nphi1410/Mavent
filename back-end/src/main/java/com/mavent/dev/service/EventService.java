package com.mavent.dev.service;

import com.mavent.dev.DTO.EventDTO;
import java.util.List;

public interface EventService {
    List<EventDTO> getAllEvents();
    EventDTO getEventById(Integer eventId);
    EventDTO updateEvent(Integer eventId, EventDTO eventDTO);
}
