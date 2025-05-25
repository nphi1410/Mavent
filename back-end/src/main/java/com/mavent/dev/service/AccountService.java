package com.mavent.dev.service;

import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AccountService {
    void register(Account accountInfo);
    UserProfileDTO getUserProfile(String username);
    void updateProfile(String username, UserProfileDTO userProfileDTO);
    boolean checkLogin(String username, String password);
    List<Account> findAllAccount();
}
