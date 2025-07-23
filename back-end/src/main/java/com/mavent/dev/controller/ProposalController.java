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

    @GetMapping("/{eventId}/get-proposal")
    public ResponseEntity<?> getProposal(@PathVariable Integer eventId) {
        try {
            ProposalDTO proposal = proposalService.getProposalByEventId(eventId);
            return ResponseEntity.ok(proposal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching proposal: " + e.getMessage());
        }
    }

}
