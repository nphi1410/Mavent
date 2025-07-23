package com.mavent.dev.controller;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.dto.PaymentMethodSummaryDTO;
import com.mavent.dev.service.ExpenseExportService; // BỔ SUNG DÒNG NÀY
import com.mavent.dev.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final ExpenseExportService expenseExportService; // BỔ SUNG DÒNG NÀY

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
     * @apiNote Hiển thị ra các phương thức thanh toán và tổng số tiền ứng với mỗi phương thức cho một sự kiện.
     * @param eventId The ID of the event.
     * @return A ResponseEntity containing a list of PaymentMethodSummaryDTO and HTTP status.
     */
    @GetMapping("/payment-methods/event/{eventId}")
    public ResponseEntity<List<PaymentMethodSummaryDTO>> getPaymentMethodSummariesByEventId(@PathVariable Integer eventId) {
        List<PaymentMethodSummaryDTO> paymentMethods = expenseService.getPaymentMethodSummariesByEventId(eventId);
        return ResponseEntity.ok(paymentMethods);
    }

    /**
     * @apiNote Hiển thị ra số lượng Expense theo Status (PENDING, REJECTED, PAID, APPROVED)
     * @param eventId The ID of the event.
     * @return A ResponseEntity containing a list of ExpenseSummaryByStatusDTO and HTTP status.
     */
    @GetMapping("/count-by-status/event/{eventId}")
    public ResponseEntity<List<ExpenseSummaryByStatusDTO>> getExpenseCountByStatusForEvent(@PathVariable Integer eventId) {
        List<ExpenseSummaryByStatusDTO> expenseCount = expenseService.getExpenseCountByStatusForEvent(eventId);
        return ResponseEntity.ok(expenseCount);
    }

    /**
     * @apiNote Xuất dữ liệu chi tiêu của sự kiện ra file Excel.
     * @param eventId The ID of the event.
     * @return A ResponseEntity containing the Excel file as a ByteArrayResource.
     */
    @GetMapping("/export/excel/event/{eventId}")
    public ResponseEntity<InputStreamResource> exportExpensesToExcel(@PathVariable Integer eventId) throws IOException {
        ByteArrayInputStream bis = expenseExportService.exportExpensesToExcel(eventId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=expenses_event_" + eventId + ".xlsx");
        headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(bis));
    }
}