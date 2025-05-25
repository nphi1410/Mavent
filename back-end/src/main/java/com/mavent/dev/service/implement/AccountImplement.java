package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public void register(Account accountInfo) {
        //Lấy thông tin
        // verify
        // tạo tài khoản
        accountRepository.save(accountInfo);
    }

}
