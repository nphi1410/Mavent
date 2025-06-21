package com.mavent.dev.mapper;

import com.mavent.dev.dto.account.AccountDTO;
import com.mavent.dev.entity.Account;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {

    public static AccountDTO toDTO(Account account) {
        if (account == null) {
            return null;
        }
        return new AccountDTO(
                account.getAccountId(),
                account.getUsername(),
                account.getEmail(),
                account.getFullName(),
                account.getPhoneNumber(),
                account.getSystemRole().name(),
                account.getAvatarUrl(),
                account.getIsDeleted()
        );
    }

    public Account toEntity(AccountDTO accountDTO) {
        if (accountDTO == null) {
            return null;
        }

        Account account = new Account();
        account.setUsername(accountDTO.getUsername());
        account.setEmail(accountDTO.getEmail());
        account.setFullName(accountDTO.getFullName());
        account.setPhoneNumber(accountDTO.getPhoneNumber());

        if (accountDTO.getSystemRole() != null) {
            account.setSystemRole(Account.SystemRole.valueOf(accountDTO.getSystemRole()));
        }

        account.setAvatarUrl(accountDTO.getAvatarUrl());

        if (accountDTO.getIsDeleted() != null) {
            account.setIsDeleted(accountDTO.getIsDeleted());
        }

        return account;
    }

    public void updateEntityFromDTO(Account account, AccountDTO accountDTO) {
        if (account == null || accountDTO == null) {
            return;
        }

        account.setUsername(accountDTO.getUsername());
        account.setEmail(accountDTO.getEmail());
        account.setFullName(accountDTO.getFullName());
        account.setPhoneNumber(accountDTO.getPhoneNumber());

        if (accountDTO.getSystemRole() != null) {
            account.setSystemRole(Account.SystemRole.valueOf(accountDTO.getSystemRole()));
        }
        account.setAvatarUrl(accountDTO.getAvatarUrl());

        if (accountDTO.getIsDeleted() != null) {
            account.setIsDeleted(accountDTO.getIsDeleted());
        }
    }
}

