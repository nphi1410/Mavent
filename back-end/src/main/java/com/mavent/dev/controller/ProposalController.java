package com.mavent.dev.controller;

import com.mavent.dev.dto.event.ProposalDTO;
import com.mavent.dev.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @PostMapping("/{eventId}/create-proposal")
    public ResponseEntity<ProposalDTO> createProposal(@PathVariable Integer eventId, @RequestBody ProposalDTO dto) {
        ProposalDTO proposalItem = proposalService.createProposalItem(eventId, dto);
        return ResponseEntity.ok(proposalItem);
    }
}
