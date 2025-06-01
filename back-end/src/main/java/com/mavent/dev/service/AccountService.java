package com.mavent.dev.service;

import com.mavent.dev.DTO.superadmin.AccountDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;

import java.util.List;

public interface AccountService {
    /**
     * Get all active accounts with pagination.
     * @param pageable pagination parameters
     * @return page of account DTOs
     */
    Page<AccountDTO> getAllActiveAccounts(Pageable pageable);

    void save(Account accountInfo);
    boolean checkLogin(String username, String password);
    UserProfileDTO getUserProfile(String username);
    UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO);
    List<UserEventDTO> getUserEvents(Integer accountId);
    Account getAccount(String username);

    Account getAccountByEmail(String email);
    String isOtpTrue(String originalOTP, long otpCreatedTime, String requestOtp);
    String getRandomOTP();
    void updateAvatar(String username, String imageUrl);
    List<TaskDTO> getUserTasks(Integer accountId, String status, String priority,
                               String keyword, String sortOrder, String eventName);

    String getRandomPassword(int length);
}

    // Sửa trả về List<AccountDTO> thay vì List<Account>
    List<AccountDTO> getAllAccounts();
    AccountDTO getAccountById(Integer id);
}
