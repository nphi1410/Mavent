package com.mavent.dev.controller;

import com.mavent.dev.dto.event.AgendaDTO;
import com.mavent.dev.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class AgendaController {
    private final AgendaService agendaService;

    @PostMapping("/{eventId}/create-agenda")
    public ResponseEntity<AgendaDTO> createAgendaItem(@PathVariable Integer eventId, @RequestBody AgendaDTO dto) {
        AgendaDTO agendaItem = agendaService.createAgendaItem(eventId, dto);
        return ResponseEntity.ok(agendaItem);
    }

    @GetMapping("/{eventId}/agenda")
    public ResponseEntity<?> getAgendaItems(@PathVariable Integer eventId) {
        try {
            return ResponseEntity.ok(agendaService.getAgendaItemsByEventId(eventId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving agenda items: " + e.getMessage());
        }
    }
}
