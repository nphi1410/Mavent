package com.mavent.dev.repository;

import com.mavent.dev.entity.EventFeedback;
import com.mavent.dev.entity.EventFeedback.PK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback, PK> {
    List<EventFeedback> findByEventId(Integer eventId);
}
