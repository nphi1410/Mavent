package com.mavent.dev.controller;

import com.mavent.dev.DTO.FilterEventDTO;
import com.mavent.dev.DTO.superadmin.EventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.service.EventService;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    public Page<FilterEventDTO> getFilterEvents(@RequestBody FilterRequest request) {
        System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+request.getName());
        return eventService.getFilterEvents(
                request.getName(),
                request.getStatus(),
                request.getTagIds(),
                request.getSortType(),
                request.getPage(),
                request.getSize()
        );
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class FilterRequest {
        private String name;
        private String status;
        private List<Integer> tagIds;
        private String sortType = "START_DATE_ASC";
        private int page;
        private int size = 10;
    }




    //Get Event By ID
    @GetMapping("/{id}")
    public EventDTO getEventById(@PathVariable("id") Integer eventId) {
        return eventService.getEventById(eventId);
    }

    // Update Event
    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable("id") Integer eventId,
                                                @RequestBody EventDTO eventDTO) {
        EventDTO updatedEvent = eventService.updateEvent(eventId, eventDTO);
        return ResponseEntity.ok(updatedEvent);
    }
}
