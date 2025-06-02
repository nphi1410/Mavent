package com.mavent.dev.mapper;

import com.mavent.dev.dto.account.AccountDTO;
import com.mavent.dev.entity.Account;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Account entity and AccountDTO.
 */
@Component
public class AccountMapper {

    /**
     * Convert Account entity to AccountDTO.
     * @param account the account entity
     * @return AccountDTO
     */
    public static AccountDTO toDTO(Account account) {
        if (account == null) {
            return null;
        }        return new AccountDTO(
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

    /**
     * Convert AccountDTO to Account entity (for creation).
     * Note: This does not set ID, password, timestamps as they are handled separately.
     * @param accountDTO the account DTO
     * @return Account entity
     */
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
            account.setSystemRole(Account.SystemRole.valueOf(accountDTO.getSystemRole()));        }

        account.setAvatarUrl(accountDTO.getAvatarUrl());

        if (accountDTO.getIsDeleted() != null) {
            account.setIsDeleted(accountDTO.getIsDeleted());
        }

        return account;
    }

    /**
     * Update existing Account entity with data from AccountDTO.
     * @param account the existing account entity
     * @param accountDTO the account DTO with updated data
     */
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
        }        account.setAvatarUrl(accountDTO.getAvatarUrl());

        if (accountDTO.getIsDeleted() != null) {
            account.setIsDeleted(accountDTO.getIsDeleted());
        }
    }
}

