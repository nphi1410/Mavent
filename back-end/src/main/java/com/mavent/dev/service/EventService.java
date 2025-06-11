package com.mavent.dev.service;

import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Event;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EventService {
    List<EventDTO> getAllEvents();

    Page<FilterEventDTO> getFilterEvents(String name, String status, List<Integer> tagIds, String sortType, int page, int size, String type, boolean isTrending);

    EventDTO getEventById(Integer eventId);

    Event getEventEntityById(Integer eventId);

    EventDTO updateEvent(Integer eventId, EventDTO eventDTO);

    Page<T> getEventByDateRange(String type, Boolean isTrending);
}
