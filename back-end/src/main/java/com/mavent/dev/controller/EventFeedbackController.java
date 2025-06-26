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

    // API GET: Lấy danh sách feedback cho sự kiện có id
    @GetMapping("/{eventId}/feedback")
    public List<EventFeedbackDTO> getFeedbackByEvent(@PathVariable int eventId) {
        return feedbackService.getEventFeedbackByEventId(eventId);
    }

    // API POST: Tạo mới feedback cho sự kiện
    @PostMapping("/{eventId}/create-feedback")
    public ResponseEntity<?> createFeedback(@PathVariable int eventId,
                                            @RequestBody EventFeedbackDTO dto) {
        try {
            // Kiểm tra xem eventId trong URL và trong body có trùng không
            if (dto.getEventId() == null || !dto.getEventId().equals(eventId)) {
                return ResponseEntity.badRequest().body("Event ID trong URL và body không khớp");
            }

            // Gọi service participantService để lưu feedback (bao gồm kiểm tra vai trò người tham gia)
            participantService.createFeedback(dto);
            return ResponseEntity.ok("Tạo feedback thành công");

        } catch (IllegalArgumentException | IllegalStateException e) {
            // Bắt các ngoại lệ logic hoặc dữ liệu sai
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Bắt lỗi hệ thống
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
