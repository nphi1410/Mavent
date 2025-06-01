package com.mavent.dev.service;

import com.mavent.dev.DTO.AccountDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;

import java.util.List;

public interface AccountService {
    void save(Account accountInfo);
    boolean checkLogin(String username, String password);
    UserProfileDTO getUserProfile(String username);
    UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO);
    Account getAccount(String username);

    // Sửa trả về List<AccountDTO> thay vì List<Account>
    List<AccountDTO> getAllAccounts();
    AccountDTO getAccountById(Integer id);
}
