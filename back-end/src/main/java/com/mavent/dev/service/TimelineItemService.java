package com.mavent.dev.service;

import com.mavent.dev.dto.event.TimelineItemDTO;

public interface TimelineItemService {
    TimelineItemDTO createTimelineItem(Integer eventId, TimelineItemDTO dto);
}
