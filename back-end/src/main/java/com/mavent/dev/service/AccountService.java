package com.mavent.dev.service;

import com.mavent.dev.dto.account.AccountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface AccountService {
    /**
     * Get all active accounts with pagination.
     * @param pageable pagination parameters
     * @return page of account DTOs
     */
    Page<AccountDTO> getAllActiveAccounts(Pageable pageable);




}
