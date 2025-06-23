package com.mavent.dev.controller;

import com.mavent.dev.dto.event.EventFeedbackDTO;
import com.mavent.dev.service.EventFeedbackService;
import com.mavent.dev.service.EventParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event")
public class EventFeedbackController {

    @Autowired
    private EventFeedbackService feedbackService;

    @Autowired
    private EventParticipantService participantService;

    @GetMapping("/{eventId}/feedback")
    public List<EventFeedbackDTO> getFeedbackByEvent(@PathVariable int eventId) {
        return feedbackService.getEventFeedbackByEventId(eventId);
    }

    @PostMapping("/{eventId}/create-feedback")
    public ResponseEntity<?> createFeedback(@PathVariable int eventId,
                                            @RequestBody EventFeedbackDTO dto) {
        try {
            if (dto.getEventId() == null || !dto.getEventId().equals(eventId)) {
                return ResponseEntity.badRequest().body("Event ID trong URL và body không khớp");
            }

            participantService.createFeedback(dto);
            return ResponseEntity.ok("Tạo feedback thành công");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // thêm để in lỗi cụ thể ra console
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}

