package com.mavent.dev.repository;

import com.mavent.dev.entity.EventTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventTagRepository  extends JpaRepository<EventTag,Integer> {
}
