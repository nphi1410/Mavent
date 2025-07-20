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

    Account findByUsername(String username);
    List<Account> findAllByIsDeletedFalse();
    long countByIsDeletedFalse();
    Account findByEmail(String email);
    boolean existsByUsername(String username);

    /**
     * Check if email exists.
     *
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);
    List<Account> findBySystemRole(Account.SystemRole systemRole);

    @Query("SELECT a FROM Account a WHERE LOWER(a.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Account> findByFullNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT a FROM Account a WHERE a.isDeleted = false")
    List<Account> findActiveAccounts();


    @Query("SELECT COUNT(a) FROM Account a WHERE a.isDeleted = false")
    long countActiveAccounts();

    @Query("SELECT a FROM Account a WHERE a.isDeleted = false")
    Page<Account> findActiveAccounts(Pageable pageable);


}
