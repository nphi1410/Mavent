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
<<<<<<< Updated upstream
=======
    List<UserEventDTO> getUserEvents(Integer accountId);
    Account getAccount(String username);
//    List<TaskDTO> getUserTasks(Integer accountId);
    void updateAvatar(String username, String imageUrl);
    List<TaskDTO> getUserTasks(Integer accountId, String status, String priority,
                               String keyword, String sortOrder, String eventName);

>>>>>>> Stashed changes
}

