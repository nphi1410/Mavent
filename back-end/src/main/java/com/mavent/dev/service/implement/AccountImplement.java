package com.mavent.dev.service.implement;


import com.mavent.dev.DTO.AccountDTO;
import com.mavent.dev.DTO.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.mavent.dev.DTO.TaskDTO;
import com.mavent.dev.DTO.UserEventDTO;

import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Task;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.TaskRepository;
import com.mavent.dev.service.AccountService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.mavent.dev.config.MailConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Comparator;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MailConfig mailConfig;

    @Override
    public boolean checkLogin(String UsernameOrEmail, String password) {
        // Find account by username
        Account accountFoundByUsername = accountRepository.findByUsername(UsernameOrEmail);
        Account accountFoundByEmail = accountRepository.findByEmail(UsernameOrEmail);
        if (accountFoundByUsername != null && accountFoundByUsername.getPasswordHash().equals(password)) {
            return true; // Login successful with username
        } else return accountFoundByEmail != null && accountFoundByEmail.getPasswordHash().equals(password); // Login successful with email
    }

//    @Async
//    public void sendOtpAsync(String to, String otp) {
//        mailConfig.sendMail(to, "Your OTP Code", "Your OTP code is: " + otp);
//    }

    @Override
    public String isOtpTrue(String originOTP, long otpCreatedTime, String requestOtp) {
        if (originOTP == null || System.currentTimeMillis() - otpCreatedTime > 60 * 1000) {
            return "This OTP has expired.";
        }
        if (!originOTP.equals(requestOtp)) {
            return"Wrong OTP";
        }
        return null;
    }

    @Override
    public String getRandomOTP() {
        return String.valueOf((int)(Math.random() * 900000) + 100000); // 6-digit OTP
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

    @Override
    public void save(Account accountInfo) {
        accountRepository.save(accountInfo);
    }

    @Override
    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAllByIsDeletedFalse();

        return accounts.stream().map(account -> {
            AccountDTO dto = new AccountDTO();
            dto.setAccountId(account.getAccountId());
            dto.setUsername(account.getUsername());
            dto.setEmail(account.getEmail());
            dto.setFullName(account.getFullName());
            dto.setSystemRole(account.getSystemRole());  // SystemRole enum
            dto.setAvatarUrl(account.getAvatarUrl());
            dto.setPhoneNumber(account.getPhoneNumber());
            dto.setGender(account.getGender());  // Gender enum
            dto.setStudentId(account.getStudentId());
            dto.setDateOfBirth(account.getDateOfBirth());
            dto.setCreatedAt(account.getCreatedAt());
            dto.setUpdatedAt(account.getUpdatedAt());
            return dto;
        }).collect(Collectors.toList());
    }


    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = getAccount(username);
        if (account == null) {
            account = accountRepository.findByEmail(username);
        }
        return mapAccountToUserProfileDTO(account);
    }

    @Override
    public boolean checkLogin(String username, String password) {
        Account account = accountRepository.findByUsername(username);
        if (account == null) return false;
        return account.getPasswordHash().equals(password);
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
    public List<TaskDTO> getUserTasks(Integer accountId, String status, String priority,
                                      String keyword, String sortOrder, String eventName) {
        List<TaskDTO> tasks = taskRepository.findTasksWithEventAndDepartment(accountId);

        // Filter by status
        if (status != null && !status.isBlank()) {
            tasks = tasks.stream()
                    .filter(t -> t.getStatus().equalsIgnoreCase(status))
                    .toList();
        }

        // Filter by priority
        if (priority != null && !priority.isBlank()) {
            tasks = tasks.stream()
                    .filter(t -> t.getPriority().equalsIgnoreCase(priority))
                    .toList();
        }

        // Filter by event name
        if (eventName != null && !eventName.isBlank()) {
            String lowerEventName = eventName.toLowerCase();
            tasks = tasks.stream()
                    .filter(t -> t.getEventName() != null &&
                            t.getEventName().toLowerCase().contains(lowerEventName))
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

}
