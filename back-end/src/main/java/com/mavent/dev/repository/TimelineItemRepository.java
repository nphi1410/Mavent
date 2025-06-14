package com.mavent.dev.repository;

import com.mavent.dev.entity.TimelineItem;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TimelineItemRepository extends JpaRepository<TimelineItem,Long> {

}
