package com.mavent.dev.service;

import com.mavent.dev.dto.event.EventFeedbackDTO;

import java.util.List;

public interface EventFeedbackService {
    List<EventFeedbackDTO> getEventFeedbackByEventId(Integer eventId);
}
