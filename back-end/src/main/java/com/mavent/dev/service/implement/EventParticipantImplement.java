package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.EventFeedbackDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.EventFeedback;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.repository.EventFeedbackRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.EventParticipantService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventParticipantImplement implements EventParticipantService {

    private final EventAccountRoleRepository eventAccountRoleRepository;
    private final EventRepository eventRepository;
    private final EventFeedbackRepository eventFeedbackRepository;

    public EventParticipantImplement(EventAccountRoleRepository eventAccountRoleRepository, EventRepository eventRepository, EventFeedbackRepository eventFeedbackRepository) {
        this.eventAccountRoleRepository = eventAccountRoleRepository;
        this.eventRepository = eventRepository;
        this.eventFeedbackRepository = eventFeedbackRepository;
    }

    @Override
    public Page<EventAccountRole> getEndedParticipantEvents(Integer accountId, Pageable pageable) {
        // Lấy các event đã kết thúc mà user là participant
        return eventAccountRoleRepository.findByAccountId(accountId, pageable);
        // Hoặc dùng findEndedParticipantEventsByAccountId nếu bạn tạo riêng như gợi ý trên
    }

    @Override
    @Transactional
    public void createFeedback(EventFeedbackDTO dto) {

        Integer eventId = dto.getEventId();
        Integer accountId = dto.getAccountId();

        if (eventId == null || accountId == null) {
            throw new IllegalArgumentException("Event ID và Account ID không được null");
        }

        // 1. Kiểm tra user có role PARTICIPANT trong event không
        EventAccountRole role = eventAccountRoleRepository.findByEventIdAndAccountId(eventId, accountId)
                .orElseThrow(() -> new IllegalArgumentException("Bạn không có quyền feedback sự kiện này"));

        if (role.getEventRole() != EventAccountRole.EventRole.PARTICIPANT) {
            throw new IllegalStateException("Chỉ participant mới được feedback sự kiện này");
        }

        // 2. Kiểm tra event đã kết thúc chưa
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại"));

        if (!"ENDED".equals(event.getStatus().name())) {
            throw new IllegalStateException("Chỉ feedback cho sự kiện đã kết thúc");
        }

        // 3. Lưu feedback
        EventFeedback feedback = new EventFeedback();
        feedback.setEventId(eventId);
        feedback.setAccountId(accountId);
        feedback.setRating(dto.getRating());
        feedback.setComment(dto.getComment());
        feedback.setSubmittedAt(LocalDateTime.now());

        eventFeedbackRepository.save(feedback);
    }

}
