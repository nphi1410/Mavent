package com.mavent.dev.repository;

import com.mavent.dev.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepositiory extends JpaRepository<Account,Integer> {
}
