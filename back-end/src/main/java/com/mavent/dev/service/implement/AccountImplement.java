package com.mavent.dev.service.implement;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.entity.Document;
import com.mavent.dev.dto.NotificationDTO;
import com.mavent.dev.dto.task.TaskAttendeeDTO;
import com.mavent.dev.dto.task.TaskFeedbackDTO;
import com.mavent.dev.entity.*;
import com.mavent.dev.dto.task.TaskCreateDTO;
import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.repository.*;
import com.mavent.dev.service.NotificationService;
import com.mavent.dev.service.RequestService;
import com.mavent.dev.util.JwtUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.mavent.dev.dto.task.TaskDTO;
import com.mavent.dev.dto.UserEventDTO;
import com.mavent.dev.dto.UserProfileDTO;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.config.MailConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;


@Service("accountService")
public class AccountImplement implements AccountService, UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MailConfig mailConfig;

    @Autowired
    private NotificationService notificationService;


    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AccountImplement(PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }



    @Override
    public boolean checkLogin(String UsernameOrEmail, String password) {
        // Find account by username
        System.out.println("Checking login for: " + UsernameOrEmail);
//        System.out.println("Encoded password: " + passwordEncoder.encode(password));
        try {
            Account account = accountRepository.findByUsername(UsernameOrEmail);
            if (account == null && accountRepository.findByEmail(UsernameOrEmail) != null) {
                account = accountRepository.findByEmail(UsernameOrEmail);
            }
            if (account == null) {
                System.err.println("Account not found with username or email: " + UsernameOrEmail);
                return false; // Account not found
            }
//            System.out.println("Account found by username: " + accountFoundByUsername.getUsername());
//            System.out.println("Account found by email: " + accountFoundByEmail.getEmail());
            System.out.println(passwordEncoder.matches(password, account.getPasswordHash()));
            return passwordEncoder.matches(password, account.getPasswordHash());
        } catch (Exception e) {
            System.err.println("Error during login check: " + e.getMessage());
            return false; // Login failed
        }
    }

    @Override
    public String isOtpTrue(String originOTP, long otpCreatedTime, String requestOtp) {
        if (originOTP == null || System.currentTimeMillis() - otpCreatedTime > 60 * 1000) {
            return "This OTP has expired.";
        }
        if (!originOTP.equals(requestOtp)) {
            return "Wrong OTP";
        }
        return null;
    }

    @Override
    public String getRandomOTP() {
        return String.valueOf((int) (Math.random() * 900000) + 100000); // 6-digit OTP
    }

    @Override
    public String getRandomPassword(int length) {
        StringBuilder password = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * characters.length());
            password.append(characters.charAt(index));
        }
        return password.toString();
    }

    // for User Authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) throw new UsernameNotFoundException("User not found");

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + account.getSystemRole().name())
        );

        return new org.springframework.security.core.userdetails.User(
                account.getUsername(), account.getPasswordHash(), authorities
        );
    }

    @Override
    public void save(Account accountInfo) {
        accountRepository.save(accountInfo);
    }

    @Override
    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAllByIsDeletedFalse();

        return accounts.stream().map(this::mapAccountToDTO).collect(Collectors.toList());
    }

    @Override
    public Account getAccountById(Integer id) {
        return accountRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Account not found with ID: " + id));
    }

    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = getAccount(username);
        if (account == null) {
            try {
                account = accountRepository.findByEmail(username);
            } catch (Exception e) {
                System.err.println("Account not found with email: " + username);
                System.err.println("Error: " + e);
            }
        }
        return mapAccountToUserProfileDTO(account);
    }

    @Override

    public UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO) {
        Account account = getAccount(username);

        if (userProfileDTO.getFullName() != null && !userProfileDTO.getFullName().trim().isEmpty()) {
            account.setFullName(userProfileDTO.getFullName());
        }
        if (userProfileDTO.getStudentId() != null && !userProfileDTO.getStudentId().trim().isEmpty()) {
            account.setStudentId(userProfileDTO.getStudentId());
        }
        if (userProfileDTO.getPhoneNumber() != null && !userProfileDTO.getPhoneNumber().trim().isEmpty()) {
            account.setPhoneNumber(userProfileDTO.getPhoneNumber());
        }
        if (userProfileDTO.getDateOfBirth() != null) {
            account.setDateOfBirth(userProfileDTO.getDateOfBirth());
        }
        if (userProfileDTO.getGender() != null && !userProfileDTO.getGender().trim().isEmpty()) {
            try {
                account.setGender(Account.Gender.valueOf(userProfileDTO.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid gender value. Must be one of: MALE, FEMALE, OTHER");
                System.err.println("Error: " + e);
            }
        }

        Account updatedAccount = accountRepository.save(account);
        return mapAccountToUserProfileDTO(updatedAccount);
    }

    @Override
    public Account getAccount(String username) {
        Account account = null;
//                accountRepository.findByUsername(username);
        try {
            account = accountRepository.findByUsername(username);
        } catch (UsernameNotFoundException ex) {
            System.err.println("Account not found with username: " + username);
            System.err.println("Error: " + ex);
        }
        return account;
    }

    @Override
    public Account getAccountByEmail(String email) {
        Account account = null;
        try {
            account = accountRepository.findByEmail(email);
        } catch (UsernameNotFoundException ex) {
            System.err.println("Account not found with email: " + email);
            System.err.println("Error: " + ex);
        }
        return account;
    }

    private UserProfileDTO mapAccountToUserProfileDTO(Account account) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(account.getAccountId());
        dto.setUsername(account.getUsername());
        dto.setEmail(account.getEmail());
        dto.setFullName(account.getFullName());
        dto.setAvatarUrl(account.getAvatarUrl());
        dto.setPhoneNumber(account.getPhoneNumber());
        dto.setGender(account.getGender() != null ? account.getGender().name() : null);
        dto.setDateOfBirth(account.getDateOfBirth());
        dto.setStudentId(account.getStudentId());
        return dto;
    }

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<TaskDTO> getUserTasks(Integer accountId, String status, String priority, String keyword, String sortOrder, String eventName) {
        List<TaskDTO> tasks = taskRepository.findTasksWithEventAndDepartment(accountId);

        // Filter by status (multi)
        if (status != null && !status.isBlank()) {
            List<String> statusList = Arrays.stream(status.split(","))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .toList();
            tasks = tasks.stream()
                    .filter(t -> statusList.contains(t.getStatus().toUpperCase()))
                    .toList();
        }

        // Filter by priority
        if (priority != null && !priority.isBlank()) {
            tasks = tasks.stream().filter(t -> t.getPriority().equalsIgnoreCase(priority)).toList();
        }

        // Filter by event name
        if (eventName != null && !eventName.isBlank()) {
            String lowerEventName = eventName.toLowerCase();
            tasks = tasks.stream()
                    .filter(t -> t.getEventName() != null && t.getEventName().toLowerCase().contains(lowerEventName))
                    .toList();
        }

        // Search by keyword (in title)
        if (keyword != null && !keyword.isBlank()) {
            String lowerKeyword = keyword.toLowerCase();
            tasks = tasks.stream()
                    .filter(t -> t.getTitle().toLowerCase().contains(lowerKeyword))
                    .toList();
        }

        // Sort by dueDate
        if (sortOrder != null && !sortOrder.isBlank()) {
            Comparator<TaskDTO> comparator = Comparator.comparing(TaskDTO::getDueDate);
            if ("desc".equalsIgnoreCase(sortOrder)) {
                comparator = comparator.reversed();
            }
            tasks = tasks.stream().sorted(comparator).toList();
        }

        return tasks;
    }

    @Override
    public List<TaskAttendeeDTO> getTaskAttendees(Integer taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        List<TaskAttendee> attendees = taskAttendeeRepository.findByTaskId(taskId);

        return attendees.stream().map(attendee -> {
            TaskAttendeeDTO dto = new TaskAttendeeDTO();
            dto.setTaskId(attendee.getTaskId());
            dto.setAccountId(attendee.getAccountId());
            dto.setStatus(attendee.getStatus().name());

            Account account = accountRepository.findById(attendee.getAccountId()).orElse(null);
            if (account != null) {
                dto.setAccountName(account.getFullName());
                dto.setEmail(account.getEmail());
                dto.setAvatarUrl(account.getAvatarUrl());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskDetails(Integer accountId, Integer taskId) {
        List<TaskDTO> tasks = taskRepository.findTasksWithEventAndDepartment(accountId);
        System.out.println(tasks);
        return tasks.stream()
                .filter(task -> task.getTaskId().equals(taskId))
                .findFirst()
                .orElse(null);
    }

    @Autowired
    public TaskAttendeeRepository taskAttendeeRepository;

    @Autowired
    public EventRepository eventRepository;

    @Autowired
    public DepartmentRepository departmentRepository;

    @Override
    public TaskDTO createTask(TaskCreateDTO taskCreateDTO, Account creator) {
        if (taskCreateDTO.getTitle() == null || taskCreateDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Task title is required");
        }
        if (taskCreateDTO.getEventId() == null) {
            throw new IllegalArgumentException("Event ID is required");
        }
        if (taskCreateDTO.getDueDate() != null && taskCreateDTO.getDueDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Due date cannot be in the past");
        }

        Task task = new Task();
        task.setEventId(taskCreateDTO.getEventId());
        task.setDepartmentId(taskCreateDTO.getDepartmentId());
        task.setTitle(taskCreateDTO.getTitle());
        task.setDescription(taskCreateDTO.getDescription());
        task.setAssignedToAccountId(taskCreateDTO.getAssignedToAccountId());
        task.setAssignedByAccountId(creator.getAccountId());
        task.setDueDate(taskCreateDTO.getDueDate());
        task.setStatus(Task.Status.TODO);
        task.setPriority(taskCreateDTO.getPriority() != null ?
                Task.Priority.valueOf(taskCreateDTO.getPriority()) : Task.Priority.MEDIUM);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);

        // Thêm documents nếu có
        if (taskCreateDTO.getDocumentIds() != null && !taskCreateDTO.getDocumentIds().isEmpty()) {
            List<Document> documents = documentRepository.findAllById(taskCreateDTO.getDocumentIds());
            
            // Validate documents belong to same event
            for (Document doc : documents) {
                if (!savedTask.getEventId().equals(doc.getEventId())) {
                    throw new IllegalArgumentException("Document must belong to the same event as task");
                }
            }
            
            if (savedTask.getDocuments() == null) {
                savedTask.setDocuments(new ArrayList<>());
            }
            savedTask.getDocuments().addAll(documents);
            taskRepository.save(savedTask);
        }

        List<Integer> attendees = new ArrayList<>();
        if (taskCreateDTO.getTaskAttendees() != null && !taskCreateDTO.getTaskAttendees().isEmpty()) {
            attendees.addAll(taskCreateDTO.getTaskAttendees());
        }

        Integer assignedUserId = taskCreateDTO.getAssignedToAccountId();
        if (!attendees.contains(assignedUserId)) {
            attendees.add(assignedUserId);
        }
        Set<Integer> notifiedUsers = new HashSet<>();

        for (Integer attendeeId : attendees) {
            if (notifiedUsers.contains(attendeeId)) {
                continue;
            }
            notifiedUsers.add(attendeeId);

            TaskAttendee taskAttendee = new TaskAttendee();
            taskAttendee.setTaskId(savedTask.getTaskId());
            taskAttendee.setAccountId(attendeeId);
            if (attendeeId.equals(assignedUserId)) {
                taskAttendee.setStatus(TaskAttendee.Status.ACCEPTED);
            } else {
                taskAttendee.setStatus(TaskAttendee.Status.INVITED);
            }

            taskAttendeeRepository.save(taskAttendee);

            String message;
            String type;
            if (attendeeId.equals(assignedUserId)) {
                message = "You have been assigned as the main assignee for task: " + savedTask.getTitle();
                type = "TASK ASSIGNMENT";
            } else {
                message = "You have been added as an attendee to task: " + savedTask.getTitle();
                type = "TASK ATTENDEE";
            }

            notificationService.createNotification(
                    attendeeId,
                    savedTask.getEventId(),
                    null,
                    savedTask.getTaskId(),
                    type,
                    message
            );
        }

        return convertToTaskDTO(savedTask);
    }

    @Override
    public TaskDTO updateTask(Integer taskId, TaskCreateDTO updateDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        task.setTitle(updateDto.getTitle());
        task.setDescription(updateDto.getDescription());
        task.setPriority(Task.Priority.valueOf(updateDto.getPriority()));
        task.setDueDate(updateDto.getDueDate());
        task.setAssignedToAccountId(updateDto.getAssignedToAccountId());
        task.setDepartmentId(updateDto.getDepartmentId());

        // Cập nhật documents nếu có trong updateDto
        if (updateDto.getDocumentIds() != null) {
            if (task.getDocuments() != null) {
                task.getDocuments().clear();
            }
            if (!updateDto.getDocumentIds().isEmpty()) {
                List<Document> documents = documentRepository.findAllById(updateDto.getDocumentIds());
                for (Document doc : documents) {
                    if (!task.getEventId().equals(doc.getEventId())) {
                        throw new IllegalArgumentException("Document must belong to the same event as task");
                    }
                }
                if (task.getDocuments() == null) {
                    task.setDocuments(new ArrayList<>());
                }
                task.getDocuments().addAll(documents);
            }
        }

        task.setUpdatedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        // ===== GỬI NOTIFICATION CHO ATTENDEE ===== //
        List<Integer> attendeeIds = taskAttendeeRepository.findByTaskId(taskId).stream()
                .map(TaskAttendee::getAccountId)
                .collect(Collectors.toList());

        String message = "Task '" + task.getTitle() + "' has been updated.";
        String type = "TASK UPDATED";
        Integer eventId = task.getEventId();

        for (Integer attendeeId : attendeeIds) {
            notificationService.createNotification(attendeeId, eventId, null, taskId, type, message);
        }

        return convertToTaskDTO(saved);
    }



    private TaskDTO convertToTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setTaskId(task.getTaskId());
        dto.setEventId(task.getEventId());
        dto.setDepartmentId(task.getDepartmentId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setAssignedToAccountId(task.getAssignedToAccountId());
        dto.setAssignedByAccountId(task.getAssignedByAccountId());
        dto.setDueDate(task.getDueDate());
        dto.setStatus(task.getStatus().toString());
        dto.setPriority(task.getPriority().toString());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        if (task.getEventId() != null) {
            Event event = eventRepository.findByEventId(task.getEventId());
            if (event != null) {
                dto.setEventName(event.getName());
            }
        }
        if (task.getDepartmentId() != null) {
            Department department = departmentRepository.findByDepartmentId(task.getDepartmentId());
            if (department != null) {
                dto.setDepartmentName(department.getName());
            }
        }
        if (task.getDocuments() != null) {
        dto.setDocuments(
            task.getDocuments().stream()
                .map(doc -> {
                    Document docCopy = Document.builder()
                        .documentId(doc.getDocumentId())
                        .eventId(doc.getEventId())
                        .departmentId(doc.getDepartmentId())
                        .uploaderAccountId(doc.getUploaderAccountId())
                        .title(doc.getTitle())
                        .filePath(doc.getFilePath())
                        .fileType(doc.getFileType())
                        .description(doc.getDescription())
                        .createdAt(doc.getCreatedAt())
                        .updatedAt(doc.getUpdatedAt())
                        .build();
                    return docCopy;
                }).toList()
        );
    }


        return dto;
    }

    @Override
    public TaskDTO updateTaskStatus(Integer taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task không tồn tại"));

        Task.Status oldStatus = task.getStatus();

        // Nếu trạng thái cũ là DONE hoặc CANCELLED thì không gửi noti
        if (oldStatus == Task.Status.DONE || oldStatus == Task.Status.CANCELLED) {
            task.setStatus(Task.Status.valueOf(newStatus));
            task.setUpdatedAt(LocalDateTime.now());
            return convertToTaskDTO(taskRepository.save(task));
        }

        task.setStatus(Task.Status.valueOf(newStatus));
        task.setUpdatedAt(LocalDateTime.now());
        Task updatedTask = taskRepository.save(task);

        String title = task.getTitle();
        Integer eventId = task.getEventId();
        Integer taskIdVal = task.getTaskId();
        Integer assignerId = task.getAssignedByAccountId();

        String type = "TASK STATUS UPDATE";
        String message;

        List<Integer> attendeeIds = taskAttendeeRepository.findByTaskId(taskIdVal).stream()
                .map(TaskAttendee::getAccountId)
                .collect(Collectors.toList());

        switch (newStatus.toUpperCase()) {
            case "DOING" -> {
                message = "Task '" + title + "' has been started.";
                if (assignerId != null) {
                    notificationService.createNotification(assignerId, eventId, null, taskIdVal, type, message);
                }
                for (Integer attendeeId : attendeeIds) {
                    if (!attendeeId.equals(assignerId)) {
                        notificationService.createNotification(attendeeId, eventId, null, taskIdVal, type, message);
                    }
                }
            }
            case "REVIEW" -> {
                message = "Task '" + title + "' is ready for review.";
                if (assignerId != null) {
                    notificationService.createNotification(assignerId, eventId, null, taskIdVal, type, message);
                }
            }
            case "DONE" -> {
                message = "Task '" + title + "' has been marked as done.";
                for (Integer attendeeId : attendeeIds) {
                    notificationService.createNotification(attendeeId, eventId, null, taskIdVal, type, message);
                }
            }
            case "CANCELLED" -> {
                message = "Task '" + title + "' has been cancelled.";
                if (assignerId != null) {
                    notificationService.createNotification(assignerId, eventId, null, taskIdVal, type, message);
                }
                for (Integer attendeeId : attendeeIds) {
                    if (!attendeeId.equals(assignerId)) {
                        notificationService.createNotification(attendeeId, eventId, null, taskIdVal, type, message);
                    }
                }
            }
        }

        return convertToTaskDTO(updatedTask);
    }

    @Autowired
    private EventAccountRoleRepository eventAccountRoleRepository;

    @Override
    public boolean hasCreateTaskPermission(Integer eventId, Integer accountId) {
        Optional<EventAccountRole> eventRoleOpt = eventAccountRoleRepository
                .findByEventIdAndAccountId(eventId, accountId);

        return eventRoleOpt.isPresent()
                && Boolean.TRUE.equals(eventRoleOpt.get().getIsActive())
                && switch (eventRoleOpt.get().getEventRole()) {
            case ADMIN, DEPARTMENT_MANAGER -> true;
            default -> false;
        };
    }

    @Autowired
    private TaskFeedbackRepository taskFeedbackRepository;

    @Override
    public TaskFeedbackDTO createTaskFeedback(Integer taskId, Integer feedbackById, String comment) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        Integer creator = task.getAssignedByAccountId();
        Integer assignee = task.getAssignedToAccountId();
        if (!feedbackById.equals(creator) && !feedbackById.equals(assignee)) {
            return null;
        }

        TaskFeedback fb = new TaskFeedback();
        fb.setTaskId(taskId);
        fb.setFeedbackByAccountId(feedbackById);
        fb.setComment(comment);
        fb.setCreatedAt(LocalDateTime.now());

        TaskFeedback saved = taskFeedbackRepository.save(fb);

        String message = "New feedback added to task " + task.getTitle() + ".";
        if (feedbackById.equals(creator)) {
            notificationService.createNotification(
                    assignee, task.getEventId(), null, taskId, "TASK FEEDBACK", message
            );
        } else if (feedbackById.equals(assignee)) {
            notificationService.createNotification(
                    creator, task.getEventId(), null, taskId, "TASK FEEDBACK", message
            );
        }

        List<TaskAttendee> attendees = taskAttendeeRepository.findByTaskId(taskId);
        for (TaskAttendee attendee : attendees) {
            Integer id = attendee.getAccountId();
            if (!id.equals(feedbackById) && !id.equals(creator) && !id.equals(assignee)) {
                notificationService.createNotification(
                        id, task.getEventId(), null, taskId, "TASK FEEDBACK", message
                );
            }
        }

        TaskFeedbackDTO dto = new TaskFeedbackDTO();
        dto.setId(saved.getId());
        dto.setTaskId(saved.getTaskId());
        dto.setFeedbackByAccountId(saved.getFeedbackByAccountId());
        dto.setComment(saved.getComment());
        dto.setCreatedAt(saved.getCreatedAt());
        return dto;
    }


    @Override
    public List<TaskFeedbackDTO> getTaskFeedback(Integer taskId, Integer accountId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        Integer creator = task.getAssignedByAccountId();
        Integer assignee = task.getAssignedToAccountId();
        if (!accountId.equals(creator) && !accountId.equals(assignee)) {
            return null;
        }

        return taskFeedbackRepository.findByTaskId(taskId).stream().map(fb -> {
            TaskFeedbackDTO dto = new TaskFeedbackDTO();
            dto.setId(fb.getId());
            dto.setTaskId(fb.getTaskId());
            dto.setFeedbackByAccountId(fb.getFeedbackByAccountId());
            dto.setComment(fb.getComment());
            dto.setCreatedAt(fb.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateAvatar(String username, String imageUrl) {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException(username);
        }
        account.setAvatarUrl(imageUrl);
        accountRepository.save(account);
    }

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<UserEventDTO> getUserEvents(Integer accountId) {
        String sql = """
                    SELECT e.event_id, e.name AS event_name, e.description, e.status, ear.event_role, 
                           d.name AS department_name, e.banner_url
                    FROM events e
                    JOIN event_account_role ear ON e.event_id = ear.event_id
                    LEFT JOIN departments d ON ear.department_id = d.department_id
                    WHERE ear.account_id = ? AND e.is_deleted = false AND ear.is_active = true
                """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter(1, accountId);

        List<Object[]> results = query.getResultList();
        List<UserEventDTO> eventList = new ArrayList<>();

        for (Object[] row : results) {
            Integer eventId = (Integer) row[0];
            String name = (String) row[1];
            String description = (String) row[2];
            String status = (String) row[3];
            String role = (String) row[4];
            String departmentName = (String) row[5];
            String bannerUrl = (String) row[6];

            if (!"MEMBER".equals(role)) {
                departmentName = null;
            }

            eventList.add(new UserEventDTO(eventId, name, description, status, role, departmentName, bannerUrl));
        }

        return eventList;
    }

    private AccountDTO mapAccountToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setAccountId(account.getAccountId());
        dto.setUsername(account.getUsername());
        dto.setEmail(account.getEmail());
        dto.setFullName(account.getFullName());
        dto.setSystemRole(account.getSystemRole());
        dto.setAvatarUrl(account.getAvatarUrl());
        dto.setPhoneNumber(account.getPhoneNumber());
        dto.setGender(account.getGender());
        dto.setStudentId(account.getStudentId());
        dto.setDateOfBirth(account.getDateOfBirth());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }

    @Override
    @Transactional
    public void updateTaskAttendees(Integer taskId, Integer assignedToAccountId, List<Integer> attendeeIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task không tồn tại"));
        System.out.println("Updating attendees for task ID: " + taskId);

        List<TaskAttendee> oldAttendees = taskAttendeeRepository.findByTaskId(taskId);
        Set<Integer> oldAttendeeIds = oldAttendees.stream()
                .map(TaskAttendee::getAccountId)
                .collect(Collectors.toSet());

        List<Integer> newAttendees = new ArrayList<>(attendeeIds);
        if (!newAttendees.contains(assignedToAccountId)) {
            newAttendees.add(assignedToAccountId);
        }

        Set<Integer> newAttendeeSet = new HashSet<>(newAttendees);

        Set<Integer> removedAttendees = new HashSet<>(oldAttendeeIds);
        removedAttendees.removeAll(newAttendeeSet);

        Set<Integer> addedAttendees = new HashSet<>(newAttendeeSet);
        addedAttendees.removeAll(oldAttendeeIds);

        taskAttendeeRepository.deleteByTaskId(taskId);

        for (Integer accountId : newAttendees) {
            TaskAttendee attendee = new TaskAttendee();
            attendee.setTaskId(taskId);
            attendee.setAccountId(accountId);
            attendee.setStatus(accountId.equals(assignedToAccountId) ?
                    TaskAttendee.Status.ACCEPTED : TaskAttendee.Status.INVITED);
            taskAttendeeRepository.save(attendee);
        }

        for (Integer removedId : removedAttendees) {
            notificationService.createNotification(
                    removedId,
                    task.getEventId(),
                    null,
                    taskId,
                    "TASK ATTENDEE REMOVED",
                    "You have been removed from task: " + task.getTitle()
            );
        }

        for (Integer addedId : addedAttendees) {
            String message;
            String type;
            if (addedId.equals(assignedToAccountId)) {
                message = "You are assigned as the main assignee for updated task: " + task.getTitle();
                type = "TASK ASSIGNMENT";
            } else {
                message = "You have been added as an attendee to task: " + task.getTitle();
                type = "TASK ATTENDEE";
            }

            notificationService.createNotification(
                    addedId,
                    task.getEventId(),
                    null,
                    taskId,
                    type,
                    message
            );
        }
    }


    @Override
    public Account getAccountByToken(String token) {
        String username = jwtUtil.extractUsername(token);
        if (username == null) {
            return null;
        }
        return accountRepository.findByUsername(username);
    }

    @Override
    public Boolean isSuperAdmin(Integer accountId) {
        Account account = getAccountById(accountId);
        return account.getSystemRole().name().equals("SUPER_ADMIN");
    }

    // Add these imports and autowired repository to AccountImplement
    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<NotificationDTO> getUserNotifications(Integer accountId) {
        List<Notification> notifications = notificationRepository.findByRecipientAccountIdOrderByCreatedAtDesc(accountId);

        return notifications.stream().map(this::mapNotificationToDTO).collect(Collectors.toList());
    }

    private NotificationDTO mapNotificationToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setRecipientAccountId(notification.getRecipientAccountId());
        dto.setEventId(notification.getEventId());
        dto.setRequestId(notification.getRequestId());
        dto.setTaskId(notification.getTaskId());
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setIsRead(notification.getIsRead());
        return dto;
    }

    @Override
    @Transactional
    public void markNotificationAsRead(Integer notificationId, Integer accountId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.getRecipientAccountId().equals(accountId)) {
            throw new IllegalArgumentException("Access denied");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead(Integer accountId) {
        List<Notification> notifications = notificationRepository
            .findByRecipientAccountIdAndIsReadFalse(accountId);

        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public Long getUnreadNotificationCount(Integer accountId) {
        return notificationRepository.countUnreadByRecipientAccountId(accountId);
    }

    @Autowired
    private DocumentRepository documentRepository;
    
    @Override
    public List<Document> getTaskDocuments(Integer taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        return task.getDocuments() != null ? task.getDocuments() : new ArrayList<>();
    }
    
    @Override
    @Transactional
    public void updateTaskDocuments(Integer taskId, List<Integer> documentIds) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        // Clear existing documents
        if (task.getDocuments() != null) {
            task.getDocuments().clear();
        }
        
        // Add new documents if provided
        if (documentIds != null && !documentIds.isEmpty()) {
            List<Document> documents = documentRepository.findAllById(documentIds);
            
            // Validate documents belong to same event
            for (Document doc : documents) {
                if (!task.getEventId().equals(doc.getEventId())) {
                    throw new IllegalArgumentException("Document must belong to the same event as task");
                }
            }
            
            if (task.getDocuments() == null) {
                task.setDocuments(new ArrayList<>());
            }
            task.getDocuments().addAll(documents);
        }
        List<TaskAttendee> attendees = taskAttendeeRepository.findByTaskId(taskId);
        for (TaskAttendee attendee : attendees) {
            notificationService.createNotification(
                    attendee.getAccountId(),
                    task.getEventId(),
                    null,
                    taskId,
                    "TASK DOCUMENT UPDATE",
                    "Task documents for " + task.getTitle() + " have been updated."
            );
        }

        notificationService.createNotification(
                task.getAssignedByAccountId(),
                task.getEventId(),
                null,
                taskId,
                "TASK DOCUMENT UPDATE",
                "Task documents for " + task.getTitle() + " have been updated."
        );

        taskRepository.save(task);
    }

    @Autowired
    @Lazy
    private RequestService requestService;

    @Override
    @Transactional
    public void updateAttendeeStatus(Integer taskId, Integer accountId, String status) {
        TaskAttendee attendee = taskAttendeeRepository.findByTaskIdAndAccountId(taskId, accountId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin tham gia task"));
        
        attendee.setStatus(TaskAttendee.Status.valueOf(status));
        taskAttendeeRepository.save(attendee);
    }

    @Override
    @Transactional
    public void createCancelTaskRequest(Integer taskId, Integer accountId, String reason) {
        // Lấy thông tin task để có eventId
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task do not exist"));
        
        // Tạo request cancel task với request_type_id = 4
        CreateRequestDTO requestDTO = CreateRequestDTO.builder()
            .accountId(accountId)
            .eventId(task.getEventId())
            .taskId(taskId)
            .departmentId(task.getDepartmentId())
            .requestTypeId(4) // Cancel Task request type
            .title("Reject task: " + task.getTitle())
            .content(reason)
            .build();
        
        boolean success = requestService.addRequest(requestDTO);
        if (!success) {
            throw new RuntimeException("Can not create request cancel task");
        }

        updateAttendeeStatus(taskId, accountId, "DECLINED");
        String message = "A task cancel request has been submitted for task: " + task.getTitle();
        notificationService.createNotification(
                task.getAssignedByAccountId(),
                task.getEventId(),
                null,
                task.getTaskId(),
                "REJECT TASK REQUEST",
                message
        );

    }
}

