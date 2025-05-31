package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.AccountDTO;
import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void save(Account accountInfo) {
        accountRepository.save(accountInfo);
    }

    @Override
    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAllByIsDeletedFalse();

        return accounts.stream().map(account -> {
            AccountDTO dto = new AccountDTO();
            dto.setAccountId(account.getAccountId());
            dto.setUsername(account.getUsername());
            dto.setEmail(account.getEmail());
            dto.setFullName(account.getFullName());
            dto.setSystemRole(account.getSystemRole());  // SystemRole enum
            dto.setAvatarImg(account.getAvatarImg());
            dto.setPhoneNumber(account.getPhoneNumber());
            dto.setGender(account.getGender());  // Gender enum
            dto.setStudentId(account.getStudentId());
            dto.setDateOfBirth(account.getDateOfBirth());
            dto.setCreatedAt(account.getCreatedAt());
            dto.setUpdatedAt(account.getUpdatedAt());
            return dto;
        }).collect(Collectors.toList());
    }


    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = getAccount(username);
        return mapAccountToUserProfileDTO(account);
    }

    @Override
    public boolean checkLogin(String username, String password) {
        Account account = accountRepository.findByUsername(username);
        if (account == null) return false;
        return account.getPasswordHash().equals(password);
    }

    @Override
    public UserProfileDTO updateProfile(String username, UserProfileDTO userProfileDTO) {
        Account account = getAccount(username);

        if (userProfileDTO.getFullName() != null && !userProfileDTO.getFullName().trim().isEmpty()) {
            account.setFullName(userProfileDTO.getFullName());
        }
        if (userProfileDTO.getStudentId() != null && !userProfileDTO.getStudentId().trim().isEmpty()) {
            account.setStudentId(userProfileDTO.getStudentId());
        }
        if (userProfileDTO.getPhoneNumber() != null && !userProfileDTO.getPhoneNumber().trim().isEmpty()) {
            account.setPhoneNumber(userProfileDTO.getPhoneNumber());
        }
        if (userProfileDTO.getDateOfBirth() != null) {
            account.setDateOfBirth(userProfileDTO.getDateOfBirth());
        }
        if (userProfileDTO.getGender() != null && !userProfileDTO.getGender().trim().isEmpty()) {
            try {
                account.setGender(Account.Gender.valueOf(userProfileDTO.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                System.err.println("Invalid gender value. Must be one of: MALE, FEMALE, OTHER");
                System.err.println("Error: " + e);
            }
        }

        Account updatedAccount = accountRepository.save(account);
        return mapAccountToUserProfileDTO(updatedAccount);
    }

    @Override
    public Account getAccount(String username) {
        Account account = null;
        try {
            account = accountRepository.findByUsername(username);
        } catch (UsernameNotFoundException ex) {
            System.err.println("Account not found with username: " + username);
            System.err.println("Error: " + ex);
        }
        return account;
    }

    private UserProfileDTO mapAccountToUserProfileDTO(Account account) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(account.getAccountId());
        dto.setUsername(account.getUsername());
        dto.setEmail(account.getEmail());
        dto.setFullName(account.getFullName());
        dto.setAvatarImg(account.getAvatarImg());
        dto.setPhoneNumber(account.getPhoneNumber());
        dto.setGender(account.getGender() != null ? account.getGender().name() : null);
        dto.setDateOfBirth(account.getDateOfBirth());
        dto.setStudentId(account.getStudentId());
        return dto;
    }
}
