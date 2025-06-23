package com.mavent.dev.repository;

import com.mavent.dev.entity.TaskFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskFeedbackRepository extends JpaRepository<TaskFeedback, Integer> {
    List<TaskFeedback> findByTaskId(Integer taskId);
}