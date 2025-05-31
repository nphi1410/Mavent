package com.mavent.dev.repository;

import com.mavent.dev.entity.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends CrudRepository<Task, Integer> {

    @Query(value = """
        SELECT t.* FROM tasks t
        JOIN task_attendees ta ON t.task_id = ta.task_id
        WHERE ta.account_id = :accountId
    """, nativeQuery = true)
    List<Task> findTasksByAccountId(Integer accountId);
}
