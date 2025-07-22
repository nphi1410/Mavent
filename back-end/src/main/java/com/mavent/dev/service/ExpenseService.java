package com.mavent.dev.service;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;

import java.util.List;
import java.util.Set;

public interface ExpenseService {

    /**
     * Retrieves the total expense for a specific event.
     * @param eventId The ID of the event.
     * @return EventTotalExpenseDTO containing the event ID and total amount.
     */
    EventTotalExpenseDTO getTotalExpenseByEventId(Integer eventId);

    /**
     * Retrieves expenses categorized by category for a specific event.
     * @param eventId The ID of the event.
     * @return A list of ExpenseByCategoryDTO, each containing category details and total amount for that category.
     */
    List<ExpenseByCategoryDTO> getExpensesByCategoryForEvent(Integer eventId);

    /**
     * Retrieves expenses categorized by department for a specific event.
     * @param eventId The ID of the event.
     * @return A list of ExpenseByDepartmentDTO, each containing department details and total amount for that department.
     */
    List<ExpenseByDepartmentDTO> getExpensesByDepartmentForEvent(Integer eventId);

    /**
     * Retrieves all distinct payment methods used in expenses.
     * @return A set of strings representing distinct payment methods.
     */
    Set<String> getDistinctPaymentMethodsByEventId(Integer eventId);

    /**
     * Retrieves the count of expenses grouped by their status.
     * @return A list of ExpenseSummaryByStatusDTO, each containing a status and the count of expenses with that status.
     */
    List<ExpenseSummaryByStatusDTO> getExpenseCountByStatusForEvent(Integer eventId);
}