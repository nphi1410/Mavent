package com.mavent.dev.service.implement;

import com.mavent.dev.dto.event.EventFeedbackDTO;
import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.EventFeedback;
import com.mavent.dev.repository.EventAccountRoleRepository;
import com.mavent.dev.repository.EventFeedbackRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.service.EventParticipantService;
import com.mavent.dev.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventParticipantImplement implements EventParticipantService {

    private final EventAccountRoleRepository eventAccountRoleRepository;
    private final EventRepository eventRepository;
    private final EventFeedbackRepository eventFeedbackRepository;
    @Autowired
    private NotificationService notificationService;

    public EventParticipantImplement(EventAccountRoleRepository eventAccountRoleRepository, EventRepository eventRepository, EventFeedbackRepository eventFeedbackRepository) {
        this.eventAccountRoleRepository = eventAccountRoleRepository;
        this.eventRepository = eventRepository;
        this.eventFeedbackRepository = eventFeedbackRepository;
    }

    @Override
    public Page<EventAccountRole> getEndedParticipantEvents(Integer accountId, Pageable pageable) {
        // accountId: ID của người dùng cần truy vấn
        // pageable:  thông tin phân trang (page size, page number, sort, ...)
        // Gọi repository để lấy danh sách EventAccountRole của account, chỉ những event đã kết thúc
        return eventAccountRoleRepository.findByAccountId(accountId, pageable); // repository trả về Page<EventAccountRole>
    }

    @Override
    @Transactional // Bảo đảm toàn bộ thao tác bên trong được thực hiện trong một transaction
    public void createFeedback(EventFeedbackDTO dto) {

        Integer eventId = dto.getEventId();   // Lấy eventId từ DTO truyền vào
        Integer accountId = dto.getAccountId(); // Lấy accountId từ DTO truyền vào

        if (eventId == null || accountId == null) { // Kiểm tra đầu vào hợp lệ
            throw new IllegalArgumentException("Event ID và Account ID không được null"); // Nếu null -> ném ngoại lệ
        }

        // 1. Kiểm tra user có role PARTICIPANT trong event không
        EventAccountRole role = eventAccountRoleRepository
                .findByEventIdAndAccountId(eventId, accountId) // Tìm bản ghi role theo eventId & accountId
                .orElseThrow(() -> new IllegalArgumentException("Bạn không có quyền feedback sự kiện này")); // Không tìm thấy -> ném lỗi

        if (role.getEventRole() != EventAccountRole.EventRole.PARTICIPANT) { // Nếu role khác PARTICIPANT
            throw new IllegalStateException("Chỉ participant mới được feedback sự kiện này"); // -> ném ngoại lệ phù hợp
        }

        // 2. Kiểm tra event đã kết thúc chưa
        Event event = eventRepository.findById(eventId) // Lấy thông tin event theo ID
                .orElseThrow(() -> new IllegalArgumentException("Sự kiện không tồn tại")); // Không có -> ném ngoại lệ

        if (!"ENDED".equals(event.getStatus().name())) { // Nếu trạng thái event không phải ENDED
            throw new IllegalStateException("Chỉ feedback cho sự kiện đã kết thúc"); // -> từ chối feedback
        }

        // 3. Tạo và lưu đối tượng feedback
        EventFeedback feedback = new EventFeedback(); // Khởi tạo entity EventFeedback mới
        feedback.setEventId(eventId);                // Gán ID sự kiện
        feedback.setAccountId(accountId);            // Gán ID người dùng
        feedback.setRating(dto.getRating());         // Gán số sao đánh giá
        feedback.setComment(dto.getComment());       // Gán nội dung bình luận
        feedback.setSubmittedAt(LocalDateTime.now()); // Thời gian gửi feedback

        // 4. Gửi thông báo cho tất cả ADMIN trong sự kiện
        List<EventAccountRole> admins = eventAccountRoleRepository
                .findByEventIdAndEventRole(eventId, EventAccountRole.EventRole.ADMIN)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy admin trong sự kiện này"));


        String notiType = "EVENT FEEDBACK";
        String notiMessage = "A participant has submitted feedback for event: " + event.getName();

        for (EventAccountRole admin : admins) {
            notificationService.createNotification(
                    admin.getAccountId(),
                    eventId,
                    null,
                    null,
                    notiType,
                    notiMessage
            );
        }

        eventFeedbackRepository.save(feedback); // Lưu feedback vào database thông qua repository
    }

}
