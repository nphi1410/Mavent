package com.mavent.dev.mapper;

import com.mavent.dev.dto.event.TimelineDTO;
import com.mavent.dev.entity.Timeline;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TimelineMapper {
    public static TimelineDTO toTimelineDTO(Timeline timeline) {
        if (timeline == null) {
            return null;
        }
        return TimelineDTO.builder()
                .eventId(timeline.getEventId())
                .timelineDatetime(timeline.getTimelineDatetime())
                .timelineTitle(timeline.getTimelineTitle())
                .timelineDescription(timeline.getTimelineDescription())
                // .createdByAccountId(timeline.getCreatedByAccountId())
                .build();
    }

    public static List<TimelineDTO> toTimelineDTOList(List<Timeline> timelineList) {
        if (timelineList == null || timelineList.isEmpty()) {
            return List.of();
        }
        return timelineList.stream()
                .map(TimelineMapper::toTimelineDTO)
                .toList();
    }
}
