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

    /**
     * Find accounts participating in a specific event using EventAccountRole table.
     *
     * @param eventId the event ID
     * @return list of accounts participating in the event
     */
    @Query("SELECT DISTINCT a FROM Account a JOIN EventAccountRole er ON a.accountId = er.id.accountId WHERE er.id.eventId = :eventId")
    List<Account> findAccountsByEventId(@Param("eventId") Integer eventId);

    @Query("SELECT DISTINCT a FROM Account a JOIN EventAccountRole er ON a.accountId = er.id.accountId WHERE er.departmentId = :departmentId")
    List<Account> findAccountsByDepartmentId(@Param("departmentId") Integer departmentId);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.isDeleted = false")
    long countActiveAccounts();

    @Query("SELECT a FROM Account a WHERE a.isDeleted = false")
    Page<Account> findActiveAccounts(Pageable pageable);

    /**
     * Find accounts by full name containing the search term with pagination.
     *
     * @param name     the name to search for
     * @param pageable pagination parameters
     * @return page of accounts matching the search criteria
     */
    @Query("SELECT a FROM Account a WHERE LOWER(a.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Account> findByFullNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    long countBySystemRole(Account.SystemRole systemRole);
}
