package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.TimelineDTO;
import com.mavent.dev.entity.Timeline;
import com.mavent.dev.repository.TimelineRepository;
import com.mavent.dev.service.TimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimelineImplement implements TimelineService {
    private final TimelineRepository timelineRepository;

    @Override
    public TimelineDTO createTimelineItem(Integer eventId, TimelineDTO dto) {
        Timeline timeline = Timeline.builder()
                .eventId(eventId)
                .timelineDatetime(dto.getTimelineDatetime())
                .timelineTitle(dto.getTimelineTitle())
                .timelineDescription(dto.getTimelineDescription())
//                .createdByAccountId(dto.getCreatedByAccountId())
                .build();

        Timeline savedTimeline = timelineRepository.save(timeline);

        return TimelineDTO.builder()
                .eventId(eventId)
                .timelineDatetime(dto.getTimelineDatetime())
                .timelineTitle(dto.getTimelineTitle())
                .timelineDescription(dto.getTimelineDescription())
//                .createdByAccountId(dto.getCreatedByAccountId())
                .build();
    }
}
