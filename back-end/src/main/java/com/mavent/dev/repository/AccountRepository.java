package com.mavent.dev.repository;

import com.mavent.dev.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,Integer> {
    Optional<Account> findByUsername(String username);
}
