package com.mavent.dev.service.implement;
import com.mavent.dev.dto.NotificationDTO;
import com.mavent.dev.entity.Notification;
import com.mavent.dev.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import com.mavent.dev.service.NotificationService;

@Service
public class NotificationImplement implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(Integer recipientAccountId,
                                   Integer eventId,
                                   Integer requestId,
                                   Integer taskId,
                                   String type,
                                   String message) {
        Notification notification = new Notification();
        notification.setRecipientAccountId(recipientAccountId);
        notification.setEventId(eventId);
        notification.setRequestId(requestId);
        notification.setTaskId(taskId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }
}
