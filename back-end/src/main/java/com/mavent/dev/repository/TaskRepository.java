package com.mavent.dev.repository;

import com.mavent.dev.dto.task.TaskDTO;
import com.mavent.dev.entity.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("""
    SELECT new com.mavent.dev.dto.task.TaskDTO(
        t.taskId, t.eventId, t.departmentId, t.title, t.description,
        t.assignedToAccountId, t.assignedByAccountId, t.dueDate,
        t.status, t.priority, e.name, d.name)
    FROM Task t
    LEFT JOIN Event e ON t.eventId = e.eventId
    LEFT JOIN Department d ON t.departmentId = d.departmentId
    JOIN TaskAttendee ta ON ta.taskId = t.taskId
    WHERE ta.accountId = :accountId
""")
    List<TaskDTO> findTasksWithEventAndDepartment(@Param("accountId") Integer accountId);

}
