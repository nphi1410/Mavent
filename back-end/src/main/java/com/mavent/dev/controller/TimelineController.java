package com.mavent.dev.controller;

import com.mavent.dev.dto.event.TimelineDTO;
import com.mavent.dev.service.TimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class TimelineController {
    private final TimelineService timelineService;

    @PostMapping("/{eventId}/create-timeline")
    public ResponseEntity<TimelineDTO> createTimelineItem(@PathVariable Integer eventId, @RequestBody TimelineDTO dto) {
        TimelineDTO timelineItem = timelineService.createTimelineItem(eventId, dto);
        return ResponseEntity.ok(timelineItem);
    }
    @GetMapping("/{eventId}/get-timelines")
    public ResponseEntity<?> getTimeline(@PathVariable Integer eventId) {
        try {
            List<TimelineDTO> timeline = timelineService.getTimelineItemsByEventId(eventId);
            return ResponseEntity.ok(timeline);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching timeline: " + e.getMessage());
        }
    }
}
