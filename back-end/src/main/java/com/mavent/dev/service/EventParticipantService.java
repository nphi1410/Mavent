package com.mavent.dev.service;

import com.mavent.dev.dto.event.EventAccountRoleDTO;
import com.mavent.dev.dto.event.EventFeedbackDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventParticipantService {
    Page<EventAccountRoleDTO> getEndedParticipantEvents(Integer accountId, Pageable pageable);
    void createFeedback(EventFeedbackDTO dto);
}
