package com.mavent.dev.repository;

import com.mavent.dev.dto.PaymentMethodSummaryDTO;
import com.mavent.dev.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;
import java.util.Set;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> { // ĐÃ SỬA: Chuyển từ Long sang Integer

    // Query to get total expense by event ID
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.eventId = :eventId")
    BigInteger findTotalAmountByEventId(@Param("eventId") Integer eventId);

    // Query to get expenses by category for a specific event
    @Query("SELECT e FROM Expense e WHERE e.eventId = :eventId AND e.categoryId = :categoryId")
    List<Expense> findByEventIdAndCategoryId(@Param("eventId") Integer eventId, @Param("categoryId") Integer categoryId);

    // Query to get expenses by department for a specific event
    @Query("SELECT e FROM Expense e WHERE e.eventId = :eventId AND e.departmentId = :departmentId")
    List<Expense> findByEventIdAndDepartmentId(@Param("eventId") Integer eventId, @Param("departmentId") Integer departmentId);
//
//    // Query to get distinct payment methods FOR A SPECIFIC EVENT
//    @Query("SELECT DISTINCT e.paymentMethod FROM Expense e WHERE e.eventId = :eventId")
//    Set<String> findDistinctPaymentMethodsByEventId(@Param("eventId") Integer eventId);

    @Query("SELECT new com.mavent.dev.dto.PaymentMethodSummaryDTO(e.paymentMethod, SUM(e.amount)) " +
            "FROM Expense e WHERE e.eventId = :eventId GROUP BY e.paymentMethod")
    List<PaymentMethodSummaryDTO> findTotalAmountByPaymentMethodForEvent(@Param("eventId") Integer eventId);

    // Query to count expenses by status FOR A SPECIFIC EVENT
    @Query("SELECT e.status, COUNT(e) FROM Expense e WHERE e.eventId = :eventId GROUP BY e.status")
    List<Object[]> countExpensesByStatusForEvent(@Param("eventId") Integer eventId);

    // Query to get all expenses for a specific event
    List<Expense> findByEventId(Integer eventId);

    // For aggregating expenses by category for a given event
    @Query("SELECT e.categoryId, SUM(e.amount) FROM Expense e WHERE e.eventId = :eventId GROUP BY e.categoryId")
    List<Object[]> findTotalAmountByCategoryForEvent(@Param("eventId") Integer eventId);

    // For aggregating expenses by department for a given event
    @Query("SELECT e.departmentId, SUM(e.amount) FROM Expense e WHERE e.eventId = :eventId GROUP BY e.departmentId")
    List<Object[]> findTotalAmountByDepartmentForEvent(@Param("eventId") Integer eventId);
}