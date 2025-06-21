package com.mavent.dev.controller;

import com.mavent.dev.dto.event.EventFeedbackDTO;
import com.mavent.dev.service.EventFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event")
public class EventFeedbackController {

    @Autowired
    private EventFeedbackService feedbackService;

    @GetMapping("/{eventId}/feedback")
    public List<EventFeedbackDTO> getFeedbackByEvent(@PathVariable int eventId) {
        return feedbackService.getEventFeedbackByEventId(eventId);
    }
}
