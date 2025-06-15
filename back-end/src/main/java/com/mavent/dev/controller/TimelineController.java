package com.mavent.dev.controller;

import com.mavent.dev.dto.event.TimelineItemDTO;
import com.mavent.dev.service.TimelineItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class TimelineItemController {
    private final TimelineItemService timelineItemService;

    @PostMapping("/{eventId}/create-timeline")
    public ResponseEntity<TimelineItemDTO> createTimelineItem(@PathVariable Integer eventId, @RequestBody TimelineItemDTO dto) {
        TimelineItemDTO timelineItem = timelineItemService.createTimelineItem(eventId, dto);
        return ResponseEntity.ok(timelineItem);
    }
}
