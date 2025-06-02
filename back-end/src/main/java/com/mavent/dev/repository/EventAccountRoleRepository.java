package com.mavent.dev.repository;


import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.EventAccountRoleId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for EventAccountRole entity operations.
 * Provides data access methods for event-account role relationships.
 */
@Repository
public interface EventAccountRoleRepository extends JpaRepository<EventAccountRole, EventAccountRoleId> {

    /**
     * Find all roles for a specific event using composite key.
     * @param eventId the event ID
     * @return list of event-account roles for the event
     */
    List<EventAccountRole> findByEventId(Integer eventId);    /**
     * Find all roles for a specific event with pagination.
     * @param eventId the event ID
     * @param pageable pagination information
     * @return page of event-account roles for the event
     */
    Page<EventAccountRole> findByEventId(Integer eventId, Pageable pageable);

    /**
     * Find all roles for a specific account using composite key.
     * @param accountId the account ID
     * @return list of event-account roles for the account
     */
    List<EventAccountRole> findByAccountId(Integer accountId);

    /**
     * Find roles by event and account using composite key.
     * @param eventId the event ID
     * @param accountId the account ID
     * @return optional role for the account in the event
     */
    Optional<EventAccountRole> findByEventIdAndAccountId(Integer eventId, Integer accountId);    /**
     * Find roles by event and event role.
     * @param eventId the event ID
     * @param eventRole the event role
     * @return list of accounts with the specified role in the event
     */
    List<EventAccountRole> findByEventIdAndEventRole(Integer eventId, EventAccountRole.EventRole eventRole);    /**
     * Find roles by department ID.
     * @param departmentId the department ID
     * @return list of event-account roles in the department
     */
    List<EventAccountRole> findByDepartmentId(Integer departmentId);

    /**
     * Find roles by event and active status.
     * @param eventId the event ID
     * @param isActive the active status
     * @return list of event-account roles
     */
    List<EventAccountRole> findByEventIdAndIsActive(Integer eventId, Boolean isActive);

    /**
     * Find roles by event and active status with pagination.
     * @param eventId the event ID
     * @param isActive the active status
     * @param pageable pagination information
     * @return page of event-account roles
     */
    Page<EventAccountRole> findByEventIdAndIsActive(Integer eventId, Boolean isActive, Pageable pageable);

    /**
     * Find roles by event, role and active status.
     * @param eventId the event ID
     * @param eventRole the event role
     * @param isActive the active status
     * @return list of event-account roles
     */
    List<EventAccountRole> findByEventIdAndEventRoleAndIsActive(Integer eventId, EventAccountRole.EventRole eventRole, Boolean isActive);

    /**
     * Check if an account has a specific role in an event.
     * @param eventId the event ID
     * @param accountId the account ID
     * @param eventRole the event role
     * @return true if the account has the role in the event, false otherwise
     */
    @Query("SELECT COUNT(ear) > 0 FROM EventAccountRole ear WHERE ear.eventId = :eventId AND ear.accountId = :accountId AND ear.eventRole = :eventRole")
    boolean hasRoleInEvent(@Param("eventId") Integer eventId, @Param("accountId") Integer accountId, @Param("eventRole") EventAccountRole.EventRole eventRole);    /**
     * Check if an account is an organizer of an event.
     * @param eventId the event ID
     * @param accountId the account ID
     * @return true if the account is an organizer of the event, false otherwise
     */    @Query("SELECT COUNT(ear) > 0 FROM EventAccountRole ear WHERE ear.eventId = :eventId AND ear.accountId = :accountId AND ear.eventRole = 'ADMIN'")
    boolean isOrganizerOfEvent(@Param("eventId") Integer eventId, @Param("accountId") Integer accountId);

    /**
     * Check if an account is a participant in an event.
     * @param eventId the event ID
     * @param accountId the account ID
     * @return true if the account is a participant in the event, false otherwise
     */    @Query("SELECT COUNT(ear) > 0 FROM EventAccountRole ear WHERE ear.eventId = :eventId AND ear.accountId = :accountId AND ear.eventRole = 'PARTICIPANT'")
    boolean isParticipantInEvent(@Param("eventId") Integer eventId, @Param("accountId") Integer accountId);

    /**
     * Count participants for an event.
     * @param eventId the event ID
     * @return number of participants in the event
     */    @Query("SELECT COUNT(ear) FROM EventAccountRole ear WHERE ear.eventId = :eventId AND ear.eventRole = 'PARTICIPANT'")
    long countParticipantsByEventId(@Param("eventId") Integer eventId);

    /**
     * Count members by department.
     * @param departmentId the department ID
     * @return number of members in the department
     */
    long countByDepartmentId(Integer departmentId);

    /**
     * Find role by event, account, and department.
     * @param eventId the event ID
     * @param accountId the account ID
     * @param departmentId the department ID (can be null)
     * @return optional event-account role
     */    @Query("SELECT ear FROM EventAccountRole ear WHERE ear.eventId = :eventId AND ear.accountId = :accountId AND (:departmentId IS NULL OR ear.departmentId = :departmentId)")
    Optional<EventAccountRole> findByEventIdAndAccountIdAndDepartmentId(@Param("eventId") Integer eventId, @Param("accountId") Integer accountId, @Param("departmentId") Integer departmentId);/**
     * Check if member exists in event using composite key.
     */
    boolean existsByEventIdAndAccountId(Integer eventId, Integer accountId);

    /**
     * Find members with search filter using composite key.
     */    @Query("SELECT ear FROM EventAccountRole ear " +
           "JOIN Account a ON a.accountId = ear.accountId " +
           "WHERE ear.eventId = :eventId " +
           "AND (LOWER(a.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(a.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(a.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(a.studentId) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<EventAccountRole> findByEventIdWithSearch(
            @Param("eventId") Integer eventId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);

    /**
     * Count members by role in event using composite key.
     */    @Query("SELECT COUNT(ear) FROM EventAccountRole ear " +
           "WHERE ear.eventId = :eventId AND ear.eventRole = :role")
    long countByEventIdAndRole(@Param("eventId") Integer eventId, @Param("role") EventAccountRole.EventRole role);

    /**
     * Count active members in event using composite key.
     */    @Query("SELECT COUNT(ear) FROM EventAccountRole ear " +
           "WHERE ear.eventId = :eventId AND ear.isActive = :isActive")
    long countByEventIdAndActiveStatus(@Param("eventId") Integer eventId, @Param("isActive") Boolean isActive);    /**
     * Complex query with multiple filters including search term.
     * Updated to handle isActive properly for consistent filtering behavior
     * and to include search term functionality.
     */    @Query("SELECT ear FROM EventAccountRole ear " +
           "JOIN Account a ON a.accountId = ear.accountId " +
           "LEFT JOIN Department d ON d.departmentId = ear.departmentId " +
           "WHERE ear.eventId = :eventId " +
           "AND (:isActive IS NULL OR ear.isActive = :isActive) " +
           "AND (:eventRole IS NULL OR ear.eventRole = :eventRole) " +
           "AND (:departmentId IS NULL OR :departmentId = 0 OR ear.departmentId = :departmentId) "+           "AND (:searchTerm IS NULL OR LENGTH(TRIM(:searchTerm)) = 0 OR " +
           "     LOWER(a.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "     LOWER(a.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "     LOWER(a.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "     LOWER(COALESCE(a.studentId, '')) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND (:startDate IS NULL OR DATE(ear.createdAt) >= DATE(:startDate)) " +
           "AND (:endDate IS NULL OR DATE(ear.createdAt) <= DATE(:endDate))")
    Page<EventAccountRole> findByEventIdWithFilters(@Param("eventId") Integer eventId,
                                                    @Param("isActive") Boolean isActive,
                                                    @Param("eventRole") EventAccountRole.EventRole eventRole,
                                                    @Param("departmentId") Integer departmentId,
                                                    @Param("searchTerm") String searchTerm,
                                                    @Param("startDate") java.util.Date startDate,
                                                    @Param("endDate") java.util.Date endDate,
                                                    Pageable pageable);
}
