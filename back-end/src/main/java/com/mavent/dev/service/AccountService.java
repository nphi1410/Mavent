package com.mavent.dev.service;

import com.mavent.dev.dto.task.TaskAttendeeDTO;
import com.mavent.dev.dto.task.TaskCreateDTO;
import com.mavent.dev.dto.task.TaskDTO;
import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.dto.UserProfileDTO;
import com.mavent.dev.dto.task.TaskFeedbackDTO;
import com.mavent.dev.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface AccountService extends UserDetailsService {

    Page<AccountDTO> getAllActiveAccounts(Pageable pageable);

    void save(Account accountInfo);

    boolean checkLogin(String username, String password);

    UserProfileDTO getUserProfile(String username);

    UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO);

    List<com.mavent.dev.dto.UserEventDTO> getUserEvents(Integer accountId);

    Account getAccount(String username);

    Account getAccountByEmail(String email);

    String isOtpTrue(String originalOTP, long otpCreatedTime, String requestOtp);

    String getRandomOTP();

    void updateAvatar(String username, String imageUrl);

    List<TaskDTO> getUserTasks(Integer accountId, String status, String priority,
                               String keyword, String sortOrder, String eventName);
    TaskDTO getTaskDetails(Integer accountId, Integer taskId);

    List<TaskAttendeeDTO> getTaskAttendees(Integer taskId);

    TaskDTO createTask(TaskCreateDTO taskCreateDTO, Account creator) throws Exception;

    TaskDTO updateTask(Integer taskId, TaskCreateDTO updateDto);

    TaskDTO updateTaskStatus(Integer taskId, String newStatus);

    boolean hasCreateTaskPermission(Integer eventId, Integer accountId);

    TaskFeedbackDTO createTaskFeedback(Integer taskId, Integer feedbackById, String comment);

    List<TaskFeedbackDTO> getTaskFeedback(Integer taskId, Integer accountId);

    String getRandomPassword(int length);

    List<AccountDTO> getAllAccounts();

    AccountDTO getAccountById(Integer id);

    void updateTaskAttendees(Integer taskId, Integer assignedToAccountId, List<Integer> attendeeIds);
}

