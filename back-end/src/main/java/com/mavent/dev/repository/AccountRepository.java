package com.mavent.dev.repository;

import com.mavent.dev.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    Account findByUsername(String username);

    List<Account> findAllByIsDeletedFalse();

    long countByIsDeletedFalse();
    Account findByEmail(String email);
}
