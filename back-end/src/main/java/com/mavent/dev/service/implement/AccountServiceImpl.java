package com.mavent.dev.service.implement;

import com.mavent.dev.dto.account.AccountDTO;
import com.mavent.dev.mapper.AccountMapper;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
//import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    @Override
    @Transactional(readOnly = true)
    public Page<AccountDTO> getAllActiveAccounts(Pageable pageable) {
        log.debug("Fetching all active accounts with pagination");

        return accountRepository.findActiveAccounts(pageable)
                .map(AccountMapper::toDTO);
    }

}
