package com.mavent.dev.controller;

import com.mavent.dev.dto.event.TimelineDTO;
import com.mavent.dev.service.TimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
