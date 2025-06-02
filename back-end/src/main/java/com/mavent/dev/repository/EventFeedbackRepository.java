package com.mavent.dev.repository;

import com.mavent.dev.entity.EventFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventFeedbackRepository extends JpaRepository<EventFeedback,Integer> {
}
