package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.EventFeedbackDTO;
import com.mavent.dev.entity.EventFeedback;
import com.mavent.dev.repository.EventFeedbackRepository;
import com.mavent.dev.service.EventFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventFeedbackImplement implements EventFeedbackService {
    @Autowired
    private EventFeedbackRepository eventFeedbackRepository;

    @Override
    public List<EventFeedbackDTO> getEventFeedbackByEventId(Integer eventId) {
        List<EventFeedback> feedbacks = eventFeedbackRepository.findByEventId(eventId);

        return feedbacks.stream().map(fb -> EventFeedbackDTO.builder()
                .accountId(fb.getAccountId())
                .rating(fb.getRating())
                .comment(fb.getComment())
                .submittedAt(fb.getSubmittedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
