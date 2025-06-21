package com.mavent.dev.repository;

import com.mavent.dev.entity.EventTag;
import com.mavent.dev.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventTagRepository  extends JpaRepository<EventTag,Integer> {

    @Query(value = "SELECT t.* FROM event_tags et JOIN tags t ON et.tag_id = t.tag_id WHERE et.event_id = :eventId", nativeQuery = true)
    List<Tag> findByEventId(@Param("eventId") Integer eventId);

}
