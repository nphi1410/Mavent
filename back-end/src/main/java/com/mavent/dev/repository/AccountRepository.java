package com.mavent.dev.repository;

import com.mavent.dev.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Account findByAccountId(int accountId);
    Account findByUsername(String username);
    List<Account> findAllByIsDeletedFalse();
    long countByIsDeletedFalse();
    Account findByEmail(String email);
}
