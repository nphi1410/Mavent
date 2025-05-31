package com.mavent.dev.repository;

import com.mavent.dev.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    Event findByEventId(Integer eventId);
}