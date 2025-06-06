package com.mavent.dev.controller;

import com.mavent.dev.DTO.FilterEventDTO;
import com.mavent.dev.DTO.FilterRequestDTO;
import com.mavent.dev.DTO.superadmin.EventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.service.EventService;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    //Get All Event
    @GetMapping("")
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping("/filter")
    public Page<FilterEventDTO> getFilterEvents(@RequestBody FilterRequestDTO request) {
        return eventService.getFilterEvents(
                request.getName(),
                request.getStatus(),
                request.getTagIds(),
                request.getSortType(),
                request.getPage(),
                request.getSize(),
                request.getType(),
                request.isTrending()
        );
    }

    //Get Event By ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable("id") Integer eventId) {
        return eventService.getEventEntityById(eventId);
    }

    // Update Event
    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable("id") Integer eventId,
                                                @RequestBody EventDTO eventDTO) {
        EventDTO updatedEvent = eventService.updateEvent(eventId, eventDTO);
        return ResponseEntity.ok(updatedEvent);
    }
}
