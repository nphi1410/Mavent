package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Task;
import com.mavent.dev.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mavent.dev.service.TaskSchedulerService;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskSchedulerImplement implements TaskSchedulerService {

    @Autowired
    private TaskRepository taskRepository;

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void updateOverdueTasks() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("Checking for overdue tasks at " + now);
        List<Task> tasksToUpdate = taskRepository.findTasksWithDueDateBeforeAndNotOverdue(now);

        for (Task task : tasksToUpdate) {
            task.setStatus(Task.Status.OVERDUE);
            task.setUpdatedAt(now);
            taskRepository.save(task);
        }

        if (!tasksToUpdate.isEmpty()) {
            System.out.println("Updated " + tasksToUpdate.size() + " tasks to OVERDUE status");
        }
    }
}