package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.TaskDTO;
import com.mavent.dev.DTO.UserEventDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Task;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.TaskRepository;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void save(Account accountInfo) {
        accountRepository.save(accountInfo);
    }

    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = getAccount(username);
        return mapAccountToUserProfileDTO(account);
    }

    @Override
    public boolean checkLogin(String username, String password) {
        // Find account by username
        Account account = accountRepository.findByUsername(username);
        if (account == null) return false;
        // Compare raw password with stored hash (for demo, plain text; for real, use BCrypt)
        // Example for plain text (NOT recommended for production):
        return account.getPasswordHash().equals(password);
        // If using BCrypt:
        // return passwordEncoder.matches(password, account.getPasswordHash());
    }

    @Override
    public UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO) {
        Account account = getAccount(username);
        // Update profile fields
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
                System.err.println("Error: "+ e);
            }
        }

        // Save updated account
        Account updatedAccount = accountRepository.save(account);
        return mapAccountToUserProfileDTO(updatedAccount);
    }

    @Override
    public Account getAccount(String username) {
        Account account = null;
        try{
            account = accountRepository.findByUsername(username);
        }catch (UsernameNotFoundException ex){
            System.err.println("Account not found with username: " + username);
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
        dto.setAvatarImg(account.getAvatarImg());
        dto.setPhoneNumber(account.getPhoneNumber());
        dto.setGender(account.getGender() != null ? account.getGender().name() : null);
        dto.setDateOfBirth(account.getDateOfBirth());
        dto.setStudentId(account.getStudentId());
        return dto;
    }

    @Autowired
    private TaskRepository taskRepository;

    public List<TaskDTO> getUserTasks(Integer accountId) {
        List<Task> tasks = taskRepository.findTasksByAccountId(accountId);
        return tasks.stream().map(task -> {
            TaskDTO dto = new TaskDTO();
            dto.setTaskId(task.getTaskId());
            dto.setEventId(task.getEventId());
            dto.setDepartmentId(task.getDepartmentId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setAssignedToAccountId(task.getAssignedToAccountId());
            dto.setAssignedByAccountId(task.getAssignedByAccountId());
            dto.setDueDate(task.getDueDate());
            dto.setStatus(task.getStatus().name());
            dto.setPriority(task.getPriority().name());
            return dto;
        }).toList();
    }

    @Override
    public void updateAvatar(String username, String imageUrl) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));
        account.setAvatarImg(imageUrl);
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
        WHERE ear.account_id = :accountId AND e.is_deleted = false AND ear.is_active = true
    """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("accountId", accountId);

        List<Object[]> results = query.getResultList();
        List<UserEventDTO> eventList = new java.util.ArrayList<>();

        for (Object[] row : results) {
            Integer eventId = (Integer) row[0];
            String name = (String) row[1];
            String description = (String) row[2];
            String status = (String) row[3];
            String role = (String) row[4];
            String departmentName = (String) row[5];
            String bannerUrl = (String) row[6];

            if (!"MEMBER".equals(role)) {
                departmentName = null; // Chỉ lấy department nếu role là MEMBER
            }

            eventList.add(new UserEventDTO(eventId, name, description, status, role, departmentName, bannerUrl));
        }

        return eventList;
    }
}

