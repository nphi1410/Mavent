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
