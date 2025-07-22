package com.mavent.dev.controller;

import com.mavent.dev.config.MailConfig;
import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.dto.role.AddEventAccountRoleDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.mapper.EventAccountRoleMapper;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.EventAccountRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
