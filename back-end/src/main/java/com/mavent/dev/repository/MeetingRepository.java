package com.mavent.dev.repository;

import com.mavent.dev.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer> {
    List<Meeting> findByOrganizerAccountId(Integer organizerAccountId);
    List<Meeting> findByDepartmentId(Integer departmentId);
    List<Meeting> findByEventId(Integer eventId);
    List<Meeting> findByStatus(Meeting.Status status);
}


