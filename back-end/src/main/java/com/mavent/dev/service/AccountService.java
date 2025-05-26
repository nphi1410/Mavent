package com.mavent.dev.service;

import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import java.util.List;

public interface AccountService {
    void register(Account accountInfo);
        UserProfileDTO getUserProfile(String username);
    boolean checkLogin(String username, String password);
    List<Account> findAllAccount();
}