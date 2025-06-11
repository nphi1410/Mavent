package com.mavent.dev.service;

import com.mavent.dev.dto.superadmin.AccountDTO;
import com.mavent.dev.dto.UserProfileDTO; // Updated import with correct case

import com.mavent.dev.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    List<com.mavent.dev.dto.UserEventDTO> getUserEvents(Integer accountId);
    Account getAccount(String username);

    Account getAccountByEmail(String email);
    String isOtpTrue(String originalOTP, long otpCreatedTime, String requestOtp);
    String getRandomOTP();
    void updateAvatar(String username, String imageUrl);
    List<com.mavent.dev.dto.TaskDTO> getUserTasks(Integer accountId, String status, String priority,
                                                  String keyword, String sortOrder, String eventName);

    String getRandomPassword(int length);

    List<AccountDTO> getAllAccounts();

    AccountDTO getAccountById(Integer id);
}

