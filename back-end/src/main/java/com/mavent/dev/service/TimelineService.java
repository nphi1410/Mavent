package com.mavent.dev.service;

import com.mavent.dev.dto.event.TimelineDTO;

import java.util.List;

public interface TimelineService {
    TimelineDTO createTimelineItem(Integer eventId, TimelineDTO dto);
    List<TimelineDTO> getTimelineItemsByEventId(Integer eventId);
}
