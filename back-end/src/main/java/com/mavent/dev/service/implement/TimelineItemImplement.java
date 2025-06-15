package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.TimelineItemDTO;
import com.mavent.dev.entity.TimelineItem;
import com.mavent.dev.repository.TimelineItemRepository;
import com.mavent.dev.service.TimelineItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimelineItemImplement implements TimelineItemService {
    private final TimelineItemRepository timelineItemRepository;

    @Override
    public TimelineItemDTO createTimelineItem(Integer eventId, TimelineItemDTO dto) {
        TimelineItem timelineItem = TimelineItem.builder()
                .eventId(eventId)
                .timelineDatetime(dto.getTimelineDatetime())
                .timelineTitle(dto.getTimelineTitle())
                .timelineDescription(dto.getTimelineDescription())
                .createdByAccountId(dto.getCreatedByAccountId())
                .build();

        TimelineItem savedTimelineItem = timelineItemRepository.save(timelineItem);

        return TimelineItemDTO.builder()
                .eventId(eventId)
                .timelineDatetime(dto.getTimelineDatetime())
                .timelineTitle(dto.getTimelineTitle())
                .timelineDescription(dto.getTimelineDescription())
                .createdByAccountId(dto.getCreatedByAccountId())
                .build();
    }
}
