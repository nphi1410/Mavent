package com.mavent.dev.controller;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Request;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event/{eventId}/request")
public class RequestController {
    @Autowired
    private RequestService requestService;

    @GetMapping()
    public ResponseEntity<?> getAllRequests(
            @PathVariable Integer eventId
    ) {
        return ResponseEntity.ok(requestService.getRequestsByEventId(eventId));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getRequestsByDepartment(
            @PathVariable Integer eventId,
            @PathVariable Integer departmentId
    ) {
        try {
            return ResponseEntity.ok(requestService.getRequestByEventIdAndDepartmentId(eventId, departmentId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping ("/account/{accountId}")
    public ResponseEntity<?> getRequestsByAccount(
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

    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateRequest(
            @PathVariable Integer requestId,
            @RequestBody UpdateRequestDTO updateRequestDTO
    ) {
        return requestService.updateRequest(updateRequestDTO, requestId)
                ? ResponseEntity.ok("Request updated successfully")
                : ResponseEntity.status(400).body("Failed to update request");
    }

}

