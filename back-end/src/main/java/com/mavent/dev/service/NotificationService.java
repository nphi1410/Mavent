package com.mavent.dev.service;

public interface NotificationService {
    void createNotification(Integer recipientAccountId,
                            Integer eventId,
                            Integer requestId,
                            Integer taskId,
                            String type,
                            String message);
}

