package com.mavent.dev.controller;

import com.mavent.dev.config.MailConfig;
import com.mavent.dev.dto.role.AddEventAccountRoleDTO;
import com.mavent.dev.dto.role.UpdateEventAccountRoleDTO;
import com.mavent.dev.dto.role.UserRoleDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.mapper.AccountMapper;
import com.mavent.dev.mapper.EventAccountRoleMapper;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.EventAccountRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
public class EventAccountRoleController {
    @Autowired
    private EventAccountRoleService eventAccountRoleService;

    @Autowired
    private MailConfig mailConfig;

    @Autowired
    private AccountService accountService;

    @PostMapping("/{eventId}")
    public ResponseEntity<?> addEventAccountRole(@PathVariable Integer eventId, @RequestBody AddEventAccountRoleDTO addEventAccountRoleDTO) {
        // Logic to add event account role
        try {
            addEventAccountRoleDTO.setEventId(eventId);
            EventAccountRole eventAccountRole = EventAccountRoleMapper.toEntity(addEventAccountRoleDTO);
            if (eventAccountRole == null) {

                return ResponseEntity.badRequest().body("Invalid event account role data");
            }
            Account account = accountService.getAccountById(addEventAccountRoleDTO.getAccountId());
            eventAccountRoleService.addMemberToEvent(eventAccountRole);
            mailConfig.sendMail(
                    account.getEmail(),
                    "[MAVENT] You have been assigned a new role in an event",
                    "You have been assigned to be " + addEventAccountRoleDTO.getEventRole() + " in event: " + addEventAccountRoleDTO.getEventName()
            );
            return ResponseEntity.ok().body(addEventAccountRoleDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding event account role: " + e.getMessage());
        }
//        return ResponseEntity.ok("Event account role added successfully");
    }

    @PatchMapping()
    public ResponseEntity<?> updateEventAccountRole(@RequestBody UpdateEventAccountRoleDTO updateEventAccountRoleDTO) {
        try {
            EventAccountRole toBeUpdated = eventAccountRoleService.getMemberByEventIdAndAccountId(updateEventAccountRoleDTO.getEventId(), updateEventAccountRoleDTO.getAccountId());
            if (toBeUpdated == null) {
                return ResponseEntity.badRequest().body("Invalid event account role data");
            }
            toBeUpdated.setEventRole(updateEventAccountRoleDTO.getNewRole());
            toBeUpdated.setAssignedByAccountId(updateEventAccountRoleDTO.getAssignedByAccountId());
            EventAccountRole updated = eventAccountRoleService.updateMemberRole(toBeUpdated);
            return ResponseEntity.ok().body(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating event account role: " + e.getMessage());
        }
    }

    @GetMapping("/admin/{eventId}")
    public ResponseEntity<?> getAdminEventAccountRole(@PathVariable Integer eventId) {
        try {
            return ResponseEntity.ok(eventAccountRoleService.getAdminAccount(eventId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving admin event account role in event " + eventId + ": " + e.getMessage());
        }
    }

//    @PostMapping("")

}
