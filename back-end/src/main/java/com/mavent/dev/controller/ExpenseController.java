package com.mavent.dev.controller;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    /**
     * @apiNote Hiện thị ra tổng số tiền chi tiêu của từng sự kiện
     * @param eventId The ID of the event.
     * @return A ResponseEntity containing EventTotalExpenseDTO and HTTP status.
     */
    @GetMapping("/total-by-event/{eventId}")
    public ResponseEntity<EventTotalExpenseDTO> getTotalExpenseByEventId(@PathVariable Integer eventId) {
        EventTotalExpenseDTO totalExpense = expenseService.getTotalExpenseByEventId(eventId);
        return ResponseEntity.ok(totalExpense);
    }

    /**
     * @apiNote Hiện thị ra Expense theo Category của từng sự kiện đó
     * @param eventId The ID of the event.
     * @return A ResponseEntity containing a list of ExpenseByCategoryDTO and HTTP status.
     */
    @GetMapping("/by-category/event/{eventId}")
    public ResponseEntity<List<ExpenseByCategoryDTO>> getExpensesByCategoryForEvent(@PathVariable Integer eventId) {
        List<ExpenseByCategoryDTO> expenses = expenseService.getExpensesByCategoryForEvent(eventId);
        return ResponseEntity.ok(expenses);
    }

    /**
     * @apiNote Hiển thị ra Expenses by Department của từng sự kiện đó
     * @param eventId The ID of the event.
     * @return A ResponseEntity containing a list of ExpenseByDepartmentDTO and HTTP status.
     */
    @GetMapping("/by-department/event/{eventId}")
    public ResponseEntity<List<ExpenseByDepartmentDTO>> getExpensesByDepartmentForEvent(@PathVariable Integer eventId) {
        List<ExpenseByDepartmentDTO> expenses = expenseService.getExpensesByDepartmentForEvent(eventId);
        return ResponseEntity.ok(expenses);
    }

    /**
     * @apiNote Hiển thị ra Các payment method trong bảng expense
     * @return A ResponseEntity containing a set of distinct payment methods and HTTP status.
     */
    @GetMapping("/payment-methods/event/{eventId}")
    public ResponseEntity<Set<String>> getDistinctPaymentMethodsByEventId(@PathVariable Integer eventId) { // <--- Đã sửa đổi tên phương thức và tham số
        Set<String> paymentMethods = expenseService.getDistinctPaymentMethodsByEventId(eventId); // <--- Gọi phương thức service mới
        return ResponseEntity.ok(paymentMethods);
    }

    /**
     * @apiNote Hiển thị ra số lượng Expense theo Status (PENDING, REJECTED, PAID, APPROVED)
     * @return A ResponseEntity containing a list of ExpenseSummaryByStatusDTO and HTTP status.
     */
    @GetMapping("/count-by-status/event/{eventId}")
    public ResponseEntity<List<ExpenseSummaryByStatusDTO>> getExpenseCountByStatusForEvent(@PathVariable Integer eventId) { // <--- Đã sửa đổi tên phương thức và tham số
        List<ExpenseSummaryByStatusDTO> expenseCount = expenseService.getExpenseCountByStatusForEvent(eventId); // <--- Gọi phương thức service mới
        return ResponseEntity.ok(expenseCount);
    }
}