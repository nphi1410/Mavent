package com.mavent.dev.service;

import com.mavent.dev.dto.expenses.ExpenseCreateRequestDTO;
import com.mavent.dev.dto.expenses.ExpenseResponseDTO;
import com.mavent.dev.dto.expenses.ExpenseUpdateDTO;
import com.mavent.dev.entity.ExpenseAttachments;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.dto.PaymentMethodSummaryDTO;

import java.util.List;

import java.io.IOException;


public interface ExpenseService {
    
    // Method to handle receipt uploads and status change

    ExpenseResponseDTO uploadReceiptsAndUpdateStatus(int eventId, int expenseId, List<MultipartFile> files) throws IOException;

    ExpenseResponseDTO createExpenseRequest(ExpenseCreateRequestDTO dto);
    
    ExpenseResponseDTO createExpenseRequestWithAttachments(ExpenseCreateRequestDTO dto, List<MultipartFile> files) throws IOException;


    @Transactional
    List<ExpenseAttachments> uploadAttachments(int expenseId, List<MultipartFile> files, ExpenseAttachments.AttachmentType attachmentType) throws IOException;

    ExpenseResponseDTO updateExpenseStatus(ExpenseUpdateDTO dto);

    List<ExpenseResponseDTO> getExpensesByEventId(int eventId);

    List<ExpenseResponseDTO> getExpensesByEventIdAndAccountId(int eventId, int accountId);

    ExpenseResponseDTO getExpenseById(int expenseId);






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
     * Retrieves a summary of total expenses for each distinct payment method for a specific event.
     * @param eventId The ID of the event.
     * @return A list of PaymentMethodSummaryDTO, each containing payment method and its total amount.
     */
    // THAY THẾ PHƯƠNG THỨC CŨ BẰNG PHƯƠNG THỨC NÀY
    List<PaymentMethodSummaryDTO> getPaymentMethodSummariesByEventId(Integer eventId);

    /**
     * Retrieves the count of expenses grouped by their status.
     * @return A list of ExpenseSummaryByStatusDTO, each containing a status and the count of expenses with that status.
     */
    List<ExpenseSummaryByStatusDTO> getExpenseCountByStatusForEvent(Integer eventId);

}