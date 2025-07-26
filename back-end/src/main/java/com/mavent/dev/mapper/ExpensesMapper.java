package com.mavent.dev.mapper;

import com.mavent.dev.dto.expenses.ExpenseAttachmentsDTO;
import com.mavent.dev.dto.expenses.ExpenseCreateRequestDTO;
import com.mavent.dev.dto.expenses.ExpenseResponseDTO;
import com.mavent.dev.dto.expenses.ExpenseUpdateDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Department;
import com.mavent.dev.entity.ExpenseAttachments;
import com.mavent.dev.entity.ExpenseCategories;
import com.mavent.dev.entity.Expenses;
import com.mavent.dev.entity.Expenses.Status;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.repository.ExpenseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

import java.util.stream.Collectors;

@Component
public class ExpensesMapper {

    private static AccountRepository accountRepository;
    private static ExpenseCategoryRepository categoryRepository;
    private static DepartmentRepository departmentRepository;

    @Autowired
    public ExpensesMapper(AccountRepository accountRepository, 
                        ExpenseCategoryRepository categoryRepository,
                        DepartmentRepository departmentRepository) {
        ExpensesMapper.accountRepository = accountRepository;
        ExpensesMapper.categoryRepository = categoryRepository;
        ExpensesMapper.departmentRepository = departmentRepository;
    }

    public static Expenses toEntity(ExpenseCreateRequestDTO dto){
        if (dto == null) {
            return null;
        }

        return Expenses.builder()
                .eventId(dto.getEventId())
                .categoryId(dto.getCategoryId())
                .departmentId(dto.getDepartmentId())
                .amount(dto.getAmount())
                .budgetId(dto.getBudgetId())
                .note(dto.getNote())
                .status(Status.PENDING)
                .createdByAccountId(dto.getCreatedByAccountId())
                .build();
    }
    
    public static Expenses toEntity(ExpenseUpdateDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Expenses expenses = new Expenses();
        expenses.setExpenseId(dto.getExpenseId());
        expenses.setStatus(Status.valueOf(dto.getStatus().name()));
        expenses.setApprovedByAccountId(dto.getApprovedByAccountId());
        expenses.setResponseContent(dto.getResponseContent());
        
        return expenses;
    }
    
    public static ExpenseResponseDTO toDTO(Expenses expense, List<ExpenseAttachments> attachments) {
        if (expense == null) {
            return null;
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        

        ExpenseCategories category = categoryRepository.findExpenseCategoryByCategoryId(expense.getCategoryId());

        Department department = departmentRepository.findByDepartmentId(expense.getDepartmentId());

        Account createdBy = accountRepository.findByAccountId(expense.getCreatedByAccountId());
        

        Account approvedBy = null;
        if (expense.getApprovedByAccountId() != null) {
            approvedBy = accountRepository.findById(expense.getApprovedByAccountId()).orElse(null);
        }
        
        // Map attachments
        List<ExpenseAttachmentsDTO> attachmentDTOs = null;
        if (attachments != null) {
            attachmentDTOs = attachments.stream()
                .map(ExpensesMapper::toAttachmentDTO)
                .collect(Collectors.toList());
        }
        
        return ExpenseResponseDTO.builder()
                .expenseId(expense.getExpenseId())
                .eventId(expense.getEventId())
                .categoryId(expense.getCategoryId())
                .categoryName(category != null ? category.getCategoryName() : "Unknown")
                .departmentId(expense.getDepartmentId())
                .departmentName(department!=null ? department.getName() : "Unknown")
                .amount(expense.getAmount())

                .note(expense.getNote())
                .status(expense.getStatus().name())
                .createdByAccountId(expense.getCreatedByAccountId())
                .createdByFullName(createdBy!=null ? createdBy.getUsername() : "Unknown")
                .approvedByAccountId(expense.getApprovedByAccountId())

                .responseContent(expense.getResponseContent())
                .createdAt(expense.getCreatedAt() != null ? expense.getCreatedAt() : null)
                .updatedAt(expense.getUpdatedAt() != null ? expense.getUpdatedAt() : null)
                .attachments(attachmentDTOs)
                .build();
    }
    
    public static ExpenseAttachmentsDTO toAttachmentDTO(ExpenseAttachments attachment) {
        if (attachment == null) {
            return null;
        }


        
        return ExpenseAttachmentsDTO.builder()
                .attachmentId(attachment.getExpenseAttachmentId())
                .expenseId(attachment.getExpenseId())
                .fileUrl(attachment.getFileUrl())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .uploadedAt(attachment.getUploadedAt() != null ? attachment.getUploadedAt() : null)
                .build();
    }
}
