package com.mavent.dev.controller;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Request;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.RequestService;
import com.mavent.dev.mapper.RequestMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event/{eventId}/request")
public class RequestController {
    @Autowired
    private RequestService requestService;

    @Autowired
    private AccountService accountService;

    @GetMapping()
    public ResponseEntity<List<Request>> getAllRequests(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(requestService.getRequestsByEventId(eventId));
    }

    @GetMapping ("/account/{accountId}")
    public ResponseEntity<List<Request>> getRequestsByAccount(
            @PathVariable Integer eventId,
            @PathVariable Integer accountId
    ) {
        try {
            return ResponseEntity.ok(requestService.getRequestByAccountAndEventId(accountId, eventId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequestById(
            @PathVariable Integer requestId
    ) {
        try {
            return ResponseEntity.ok(requestService.getRequestByRequestId(requestId));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Request not found");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody CreateRequestDTO requestDTO) {
        return ResponseEntity.ok(requestService.addRequest(requestDTO));
    }

    @PatchMapping("/update-status")
    public ResponseEntity<?> updateRequest(
            @RequestBody UpdateRequestDTO updateRequestDTO
    ) {
        return requestService.updateRequest(updateRequestDTO)
                ? ResponseEntity.ok("Request updated successfully")
                : ResponseEntity.status(400).body("Failed to update request");
    }

}

