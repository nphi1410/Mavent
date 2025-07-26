package com.mavent.dev.repository;

import com.mavent.dev.entity.EventTag;
import com.mavent.dev.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EventTagRepository extends JpaRepository<EventTag, Integer> {

    // Method cũ của bạn - GIỮ NGUYÊN
    @Query(value = "SELECT t.* FROM event_tags et JOIN tags t ON et.tag_id = t.tag_id WHERE et.event_id = :eventId", nativeQuery = true)
    List<Tag> findByEventId(@Param("eventId") Integer eventId);

    // Method cũ của bạn - GIỮ NGUYÊN
    @Query("SELECT et FROM EventTag et WHERE et.eventId = :eventId")
    List<EventTag> findByEventIdOnly(@Param("eventId") Integer eventId);

    // THÊM METHOD MỚI - Cần thiết cho chức năng xóa tags khi update event
    @Modifying
    @Query("DELETE FROM EventTag et WHERE et.eventId = :eventId")
    void deleteByEventId(@Param("eventId") Integer eventId);

    // THÊM METHOD MỚI - Tìm EventTag theo cả eventId và tagId (có thể dùng trong tương lai)
    @Query("SELECT et FROM EventTag et WHERE et.eventId = :eventId AND et.tagId = :tagId")
    EventTag findByEventIdAndTagId(@Param("eventId") Integer eventId, @Param("tagId") Integer tagId);
}