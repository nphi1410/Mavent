package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Event;
import com.mavent.dev.entity.Department;
import com.mavent.dev.dto.TaskCreateDTO;
import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.entity.Task;
import com.mavent.dev.entity.TaskAttendee;
import com.mavent.dev.repository.TaskAttendeeRepository;
import com.mavent.dev.repository.EventRepository;
import com.mavent.dev.repository.DepartmentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.mavent.dev.dto.TaskDTO;
import com.mavent.dev.dto.UserEventDTO;
import com.mavent.dev.dto.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.TaskRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.config.MailConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;


@Service
public class AccountImplement implements AccountService, UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MailConfig mailConfig;

//    @Autowired
    private final PasswordEncoder passwordEncoder;

    public AccountImplement(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountDTO> getAllActiveAccounts(Pageable pageable) {
        return accountRepository.findActiveAccounts(pageable).map(this::mapAccountToDTO);
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
    public AccountDTO getAccountById(Integer id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Account not found with ID: " + id));

        return mapAccountToDTO(account);
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

        // Filter by status
        if (status != null && !status.isBlank()) {
            tasks = tasks.stream().filter(t -> t.getStatus().equalsIgnoreCase(status)).toList();
        }

        // Filter by priority
        if (priority != null && !priority.isBlank()) {
            tasks = tasks.stream().filter(t -> t.getPriority().equalsIgnoreCase(priority)).toList();
        }

        // Filter by event name
        if (eventName != null && !eventName.isBlank()) {
            String lowerEventName = eventName.toLowerCase();
            tasks = tasks.stream().filter(t -> t.getEventName() != null && t.getEventName().toLowerCase().contains(lowerEventName)).toList();
        }

        // Search by keyword (in title)
        if (keyword != null && !keyword.isBlank()) {
            String lowerKeyword = keyword.toLowerCase();
            tasks = tasks.stream().filter(t -> t.getTitle().toLowerCase().contains(lowerKeyword)).toList();
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
    public TaskDTO getTaskDetails(Integer accountId, Integer taskId) {
        List<TaskDTO> tasks = taskRepository.findTasksWithEventAndDepartment(accountId);
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

        if (taskCreateDTO.getTaskAttendees() != null && !taskCreateDTO.getTaskAttendees().isEmpty()) {
            for (Integer attendeeId : taskCreateDTO.getTaskAttendees()) {
                TaskAttendee taskAttendee = new TaskAttendee();
                taskAttendee.setTaskId(savedTask.getTaskId());
                taskAttendee.setAccountId(attendeeId);
                taskAttendee.setStatus(TaskAttendee.Status.INVITED);
                taskAttendeeRepository.save(taskAttendee);
            }
        }

        return convertToTaskDTO(savedTask);
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
        return dto;
    }

    public TaskDTO updateTaskStatus(Integer taskId, String newStatus) {
        // Tìm task trong cơ sở dữ liệu
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task không tồn tại"));

        // Cập nhật trạng thái
        task.setStatus(Task.Status.valueOf(newStatus));

        // Cập nhật thời gian sửa đổi
        task.setUpdatedAt(LocalDateTime.now());

        // Lưu vào cơ sở dữ liệu
        Task updatedTask = taskRepository.save(task);

        // Chuyển đổi và trả về DTO
        return convertToTaskDTO(updatedTask);
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

}

