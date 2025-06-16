package com.mavent.dev.repository;

import com.mavent.dev.entity.TaskAttendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAttendeeRepository extends JpaRepository<TaskAttendee, Integer> {
    List<TaskAttendee> findByTaskId(Integer taskId);
    List<TaskAttendee> findByAccountId(Integer accountId);
}
