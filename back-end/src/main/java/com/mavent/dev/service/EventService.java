package com.mavent.dev.service;

import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.DTO.FilterEventDTO;
import com.mavent.dev.entity.Event;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EventService {
    List<EventDTO> getAllEvents();
    Page<FilterEventDTO> getFilterEvents(String name, String status, List<Integer> tagIds, String sortType, int page, int size);
    EventDTO getEventById(Integer eventId);
    EventDTO updateEvent(Integer eventId, EventDTO eventDTO);
}
