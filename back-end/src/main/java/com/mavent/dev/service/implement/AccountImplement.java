package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void register(Account accountInfo) {
        accountRepository.save(accountInfo);
    }

    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));
        return mapAccountToUserProfileDTO(account);
    }

    @Override
    public void updateProfile(String username, UserProfileDTO userProfileDTO) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));

        account.setEmail(userProfileDTO.getEmail());
        account.setFullName(userProfileDTO.getFullName());
        account.setPhoneNumber(userProfileDTO.getPhoneNumber());
        account.setGender(userProfileDTO.getGender());

        accountRepository.save(account);
    }

    @Override
    public boolean checkLogin(String username, String password) {
        // Find account by username
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account == null) return false;
        // Compare raw password with stored hash (for demo, plain text; for real, use BCrypt)
        // Example for plain text (NOT recommended for production):
        return account.getPasswordHash().equals(password);
        // If using BCrypt:
        // return passwordEncoder.matches(password, account.getPasswordHash());
    }

    @Override
    public List<Account> findAllAccount() {
        return accountRepository.findAll();
    }

    private UserProfileDTO mapAccountToUserProfileDTO(Account account) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(account.getAccountId());
        dto.setUsername(account.getUsername());
        dto.setEmail(account.getEmail());
        dto.setFullName(account.getFullName());
        dto.setAvatarImg(account.getAvatarImg());
        dto.setPhoneNumber(account.getPhoneNumber());
        dto.setGender(account.getGender());
        dto.setDateOfBirth(account.getDateOfBirth());
        dto.setStudentId(account.getStudentId());
        return dto;
    }

}

