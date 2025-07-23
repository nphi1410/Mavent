package com.mavent.dev.service;

import com.mavent.dev.dto.expenses.ExpenseCreateRequestDTO;
import com.mavent.dev.dto.expenses.ExpenseResponseDTO;
import com.mavent.dev.dto.expenses.ExpenseUpdateDTO;
import com.mavent.dev.entity.ExpenseAttachments;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ExpenseService {

    ExpenseResponseDTO createExpenseRequest(ExpenseCreateRequestDTO dto);
    
    ExpenseResponseDTO createExpenseRequestWithAttachments(ExpenseCreateRequestDTO dto, List<MultipartFile> files) throws IOException;

    List<ExpenseAttachments> uploadAttachments(int expenseId, List<MultipartFile> files) throws IOException;

    ExpenseResponseDTO updateExpenseStatus(ExpenseUpdateDTO dto);

    List<ExpenseResponseDTO> getExpensesByEventId(int eventId);

    List<ExpenseResponseDTO> getExpensesByEventIdAndAccountId(int eventId, int accountId);

    ExpenseResponseDTO getExpenseById(int expenseId);

}
package com.mavent.dev.service;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.dto.PaymentMethodSummaryDTO; // BỔ SUNG DÒNG NÀY

import java.util.List;
import java.util.Set; // Vẫn giữ nếu bạn có các phương thức khác sử dụng Set

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