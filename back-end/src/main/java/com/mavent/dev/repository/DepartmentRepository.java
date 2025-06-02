package com.mavent.dev.repository;

import com.mavent.dev.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    /**
     * Find departments by event ID using eventId field.
     * @param eventId the event ID
     * @return list of departments for the event
     */
    List<Department> findByEventId(Integer eventId);

    /**
     * Find departments by name containing the search term (case-insensitive).
     * @param name the name to search for
     * @return list of departments matching the search criteria
     */
    @Query("SELECT d FROM Department d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Department> findByNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find departments by event ID and name.
     * @param eventId the event ID
     * @param name the department name
     * @return list of departments matching both criteria
     */
    @Query("SELECT d FROM Department d WHERE d.eventId = :eventId AND LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Department> findByEventIdAndNameContaining(@Param("eventId") Integer eventId, @Param("name") String name);

    /**
     * Check if department name exists within an event.
     * @param eventId the event ID
     * @param name the department name
     * @return true if department name exists in the event, false otherwise
     */
    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE d.eventId = :eventId AND LOWER(d.name) = LOWER(:name)")
    boolean existsByEventIdAndName(@Param("eventId") Integer eventId, @Param("name") String name);

    /**
     * Count departments by event ID using eventId field.
     * @param eventId the event ID
     * @return number of departments in the event
     */
    long countByEventId(Integer eventId);

//    /**
//     * Find departments with tasks.
//     * @param eventId the event ID
//     * @return list of departments that have tasks assigned
//     */
//    @Query("SELECT DISTINCT d FROM Department d JOIN d.tasks t WHERE d.event.eventId = :eventId")
//    List<Department> findDepartmentsWithTasks(@Param("eventId") Integer eventId);
    
    /**
     * Find departments with members (accounts assigned to them).
     * @param eventId the event ID
     * @return list of departments that have members
     */
    @Query("SELECT DISTINCT d FROM Department d WHERE d.eventId = :eventId AND EXISTS (SELECT 1 FROM EventAccountRole ear WHERE ear.departmentId = d.departmentId)")
    List<Department> findDepartmentsWithMembers(@Param("eventId") Integer eventId);

    /**
     * Get department member count.
     * @param departmentId the department ID
     * @return number of members in the department
     */
    @Query("SELECT COUNT(ear) FROM EventAccountRole ear WHERE ear.departmentId = :departmentId")
    long countMembersByDepartmentId(@Param("departmentId") Integer departmentId);
//
//    /**
//     * Get department task count.
//     * @param departmentId the department ID
//     * @return number of tasks assigned to the department
//     */
//    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedDepartment.departmentId = :departmentId")
//    long countTasksByDepartmentId(@Param("departmentId") Integer departmentId);
}
