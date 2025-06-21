package com.mavent.dev.controller;

import com.mavent.dev.dto.EventRegisterDTO;
import com.mavent.dev.dto.FilterEventDTO;
import com.mavent.dev.dto.FilterRequestDTO;
import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.EventAccountRoleService;
import com.mavent.dev.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventAccountRoleService eventAccountRoleService;
    @Autowired
    private AccountService accountService;

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
  
    @PostMapping("/create-event")
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO) {
        EventDTO createdEvent = eventService.createEvent(eventDTO);
        return ResponseEntity.ok(createdEvent);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerEvent(@RequestBody EventRegisterDTO eventRegisterDto){

        Integer accountId = accountService.getAccount(eventRegisterDto.getUsername()).getAccountId();
        EventAccountRole eventAccountRole = new EventAccountRole();
        eventAccountRole.setEventId(eventRegisterDto.getEventId());
        eventAccountRole.setEventRole(eventRegisterDto.getRole());
        eventAccountRole.setAccountId(accountId);
        eventAccountRole.setCreatedAt(LocalDateTime.now());
        if(eventRegisterDto.getRole().equals(EventAccountRole.EventRole.PARTICIPANT)){
            return ResponseEntity.ok(eventAccountRoleService.addMemberToEvent(eventAccountRole).toString());
        }

        // chua xu ly register as member
        eventAccountRole.setDepartmentId(eventRegisterDto.getDepartmentId());

        return ResponseEntity.ok(eventRegisterDto.toString());
    }

    @GetMapping("/attending/{accountId}")
    public ResponseEntity<Page<EventAccountRoleDTO>> getAttendingEvent(@PathVariable Integer accountId, Pageable pageable){
        Page<EventAccountRoleDTO> eventAccountRolePage = eventAccountRoleService.getMembersByAccountIdWithPagination(accountId,pageable);
        return ResponseEntity.ok(eventAccountRolePage);
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
