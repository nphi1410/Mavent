package com.mavent.dev.repository;

import com.mavent.dev.entity.TaskAttendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAttendeeRepository extends JpaRepository<TaskAttendee, Integer> {
    List<TaskAttendee> findByTaskId(Integer taskId);
    List<TaskAttendee> findByAccountId(Integer accountId);
    Optional<TaskAttendee> findByTaskIdAndAccountId(Integer taskId, Integer accountId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM TaskAttendee ta WHERE ta.taskId = :taskId")
    void deleteByTaskId(Integer taskId);
}
