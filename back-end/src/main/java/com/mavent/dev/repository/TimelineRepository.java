package com.mavent.dev.repository;

import com.mavent.dev.entity.Timeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelineRepository extends JpaRepository<Timeline,Long> {
    List<Timeline> findByEventId(Integer event_id);
}
