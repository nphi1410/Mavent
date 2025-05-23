package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepositiory;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;

public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepositiory accountRepositiory;

    @Override
    public void register(Account accountInfo) {
        //Lấy thông tin
        // verify
        // tạo tài khoản
        accountRepositiory.save(accountInfo);
    }

}
