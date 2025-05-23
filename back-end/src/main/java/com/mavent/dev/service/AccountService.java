package com.mavent.dev.service;

import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;

public interface AccountService {
    void register(Account accountInfo);
    UserProfileDTO getUserProfile(String username);
}
