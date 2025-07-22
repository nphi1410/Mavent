package com.mavent.dev.controller;

import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.dto.role.AddEventAccountRoleDTO;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.mapper.EventAccountRoleMapper;
import com.mavent.dev.service.EventAccountRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/role")
public class EventAccountRoleController {
    @Autowired
    private EventAccountRoleService eventAccountRoleService;

    @PostMapping("/{eventId}")
    public ResponseEntity<?> addEventAccountRole(@PathVariable Integer eventId, @RequestBody AddEventAccountRoleDTO addEventAccountRoleDTO) {
        // Logic to add event account role
        try {
            addEventAccountRoleDTO.setEventId(eventId);
            EventAccountRole eventAccountRole = EventAccountRoleMapper.toEntity(addEventAccountRoleDTO);
            if (eventAccountRole == null) {
                return ResponseEntity.badRequest().body("Invalid event account role data");
            }
            eventAccountRoleService.addMemberToEvent(eventAccountRole);
            return ResponseEntity.ok().body(addEventAccountRoleDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding event account role: " + e.getMessage());
        }
//        return ResponseEntity.ok("Event account role added successfully");
    }
}
