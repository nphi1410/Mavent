package com.mavent.dev.service;

import com.mavent.dev.dto.event.TimelineDTO;

public interface TimelineService {
    TimelineDTO createTimelineItem(Integer eventId, TimelineDTO dto);
}
