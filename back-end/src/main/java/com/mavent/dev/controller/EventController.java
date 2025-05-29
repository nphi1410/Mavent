package com.mavent.dev.controller;

import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventService eventService;

    //Lấy tất cả sự kiện
    @GetMapping("/events")
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    //Lấy chi tiết sự kiện theo ID
    @GetMapping("/events/{id}")
    public EventDTO getEventById(@PathVariable("id") Integer eventId) {
        return eventService.getEventById(eventId);
    }
}
