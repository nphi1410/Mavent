package com.mavent.dev.service;

//import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import java.util.List;

public interface AccountService {
    void register(Account accountInfo);
    boolean checkLogin(String username, String password);
    UserProfileDTO getUserProfile(String username);
    UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO);
}

