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
    /**
     * Find account by username.
     * @param username the username to search for
     * @return Optional containing the account if found
     */
    Optional<Account> findByUsername(String username);

     List<Account> findAllByIsDeletedFalse();

     long countByIsDeletedFalse();

    /**
     * Find account by email.
     * @param email the email to search for
     * @return Optional containing the account if found
     */
    Optional<Account> findByEmail(String email);

    /**
     * Check if username exists.
     * @param username the username to check
     * @return true if username exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists.
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find accounts by system role.
     * @param systemRole the system role to filter by
     * @return list of accounts with the specified role
     */
    List<Account> findBySystemRole(Account.SystemRole systemRole);

    /**
     * Find accounts by full name containing the search term (case-insensitive).
     * @param name the name to search for
     * @return list of accounts matching the search criteria
     */
    @Query("SELECT a FROM Account a WHERE LOWER(a.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Account> findByFullNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find active accounts (not deleted).
     * @return list of active accounts
     */
    @Query("SELECT a FROM Account a WHERE a.isDeleted = false")
    List<Account> findActiveAccounts();    /**
     * Find accounts participating in a specific event using EventAccountRole table.
     * @param eventId the event ID
     * @return list of accounts participating in the event
     */
    @Query("SELECT DISTINCT a FROM Account a JOIN EventAccountRole er ON a.accountId = er.id.accountId WHERE er.id.eventId = :eventId")
    List<Account> findAccountsByEventId(@Param("eventId") Integer eventId);

    /**
     * Find accounts by department using EventAccountRole table.
     * @param departmentId the department ID
     * @return list of accounts in the department
     */
    @Query("SELECT DISTINCT a FROM Account a JOIN EventAccountRole er ON a.accountId = er.id.accountId WHERE er.departmentId = :departmentId")
    List<Account> findAccountsByDepartmentId(@Param("departmentId") Integer departmentId);

    /**
     * Count total active accounts.
     * @return number of active accounts
     */
    @Query("SELECT COUNT(a) FROM Account a WHERE a.isDeleted = false")
    long countActiveAccounts();

    /**
     * Find active accounts with pagination.
     * @param pageable pagination parameters
     * @return page of active accounts
     */
    @Query("SELECT a FROM Account a WHERE a.isDeleted = false")
    Page<Account> findActiveAccounts(Pageable pageable);

    /**
     * Find accounts by full name containing the search term with pagination.
     * @param name the name to search for
     * @param pageable pagination parameters
     * @return page of accounts matching the search criteria
     */
    @Query("SELECT a FROM Account a WHERE LOWER(a.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Account> findByFullNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    /**
     * Count accounts by system role.
     * @param systemRole the system role
     * @return number of accounts with the specified role
     */
    long countBySystemRole(Account.SystemRole systemRole);
}
