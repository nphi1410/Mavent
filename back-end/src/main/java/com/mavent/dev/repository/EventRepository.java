package com.mavent.dev.repository;

import com.mavent.dev.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Event entity operations.
 * Provides data access methods for event management.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    /**
     * Find events by name containing the search term (case-insensitive).
     * @param name the name to search for
     * @return list of events matching the search criteria
     */
    @Query("SELECT e FROM Event e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Event> findByNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find events by status.
     * @param status the event status
     * @return list of events with the specified status
     */
    List<Event> findByStatus(Event.EventStatus status);

    /**
     * Find events within a date range.
     * @param startDate the start date
     * @param endDate the end date
     * @return list of events within the date range
     */
    @Query("SELECT e FROM Event e WHERE e.startDatetime >= :startDate AND e.endDatetime <= :endDate")
    List<Event> findEventsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find upcoming events (future events that are scheduled).
     * @return list of upcoming events
     */
    @Query("SELECT e FROM Event e WHERE e.startDatetime > CURRENT_TIMESTAMP AND e.status = 'SCHEDULED' ORDER BY e.startDatetime")
    List<Event> findUpcomingEvents();

    /**
     * Find active events (currently ongoing).
     * @return list of active events
     */
    @Query("SELECT e FROM Event e WHERE CURRENT_TIMESTAMP BETWEEN e.startDatetime AND e.endDatetime AND e.status = 'ONGOING'")
    List<Event> findActiveEvents();

    /**
     * Find past events.
     * @return list of past events
     */
    @Query("SELECT e FROM Event e WHERE e.endDatetime < CURRENT_TIMESTAMP ORDER BY e.endDatetime DESC")
    List<Event> findPastEvents();

    /**
     * Find events by location containing the search term.
     * @param location the location to search for
     * @return list of events at locations matching the search criteria
     */
    @Query("SELECT e FROM Event e WHERE LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Event> findByLocationContainingIgnoreCase(@Param("location") String location);    /**
     * Find events by maximum participant number greater than or equal to the specified number.
     * @param maxParticipantNumber the minimum capacity to search for
     * @return list of events with sufficient capacity
     */
    List<Event> findByMaxParticipantNumberGreaterThanEqual(Integer maxParticipantNumber);

//    /**
//     * Find events where a specific account has a role.
//     * @param accountId the account ID
//     * @return list of events where the account participates
//     */
//    @Query("SELECT DISTINCT e FROM Event e JOIN e.eventRoles er WHERE er.account.accountId = :accountId")
//    List<Event> findEventsByAccountId(@Param("accountId") Integer accountId);

//    /**
//     * Find events managed by a specific account (where account is an organizer).
//     * @param accountId the account ID
//     * @return list of events managed by the account
//     */
//    @Query("SELECT DISTINCT e FROM Event e JOIN e.eventRoles er WHERE er.account.accountId = :accountId AND er.eventRole = 'ORGANIZER'")
//    List<Event> findEventsManagedByAccount(@Param("accountId") Integer accountId);

    /**
     * Count events by status.
     * @param status the event status
     * @return number of events with the specified status
     */
    long countByStatus(Event.EventStatus status);

//    /**
//     * Find events with available spots (current participants < max participants).
//     * @return list of events with available capacity
//     */
//    @Query("SELECT e FROM Event e WHERE e.currentParticipants < e.maxParticipants AND e.status = 'SCHEDULED'")
//    List<Event> findEventsWithAvailableSpots();
//
}
