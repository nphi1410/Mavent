package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.DTO.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepositiory;

    @Override
    public void register(Account accountInfo) {
        accountRepositiory.save(accountInfo);
    }

    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = accountRepositiory.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new UserProfileDTO(
                account.getUsername(),
                account.getEmail(),
                account.getFullName(),
                account.getAvatarImg(),
                account.getPhone(),
                account.getGender()
        );
    }
}
