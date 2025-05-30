package com.mavent.dev.service;

//import com.mavent.dev.DTO.EventDTO;
import com.mavent.dev.DTO.TaskDTO;
import com.mavent.dev.DTO.UserEventDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import java.util.List;
import java.util.Optional;

public interface AccountService {
    void save(Account accountInfo);
    boolean checkLogin(String username, String password);
    UserProfileDTO getUserProfile(String username);
    UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO);
    List<UserEventDTO> getUserEvents(Integer accountId);
    Account getAccount(String username);
    List<TaskDTO> getUserTasks(Integer accountId);

}

