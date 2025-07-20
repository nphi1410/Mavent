package com.mavent.dev.repository;

import com.mavent.dev.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n WHERE n.recipientAccountId = :accountId ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientAccountIdOrderByCreatedAtDesc(@Param("accountId") Integer accountId);

    @Query("SELECT n FROM Notification n WHERE n.recipientAccountId = :accountId AND n.isRead = false")
    List<Notification> findByRecipientAccountIdAndIsReadFalse(@Param("accountId") Integer accountId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientAccountId = :accountId AND n.isRead = false")
    Long countUnreadByRecipientAccountId(@Param("accountId") Integer accountId);
}