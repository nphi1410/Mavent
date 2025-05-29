package com.mavent.dev.controller;

import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventService eventService;

    //Get All Event
    @GetMapping("/events")
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    //Get Event By ID
    @GetMapping("/events/{id}")
    public EventDTO getEventById(@PathVariable("id") Integer eventId) {
        return eventService.getEventById(eventId);
    }

    // Update Event
    @PutMapping("/events/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable("id") Integer eventId,
                                                @RequestBody EventDTO eventDTO) {
        EventDTO updatedEvent = eventService.updateEvent(eventId, eventDTO);
        return ResponseEntity.ok(updatedEvent);
    }
}
