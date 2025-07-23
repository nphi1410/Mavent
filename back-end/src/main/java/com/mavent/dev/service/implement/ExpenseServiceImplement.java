package com.mavent.dev.service.implement;

import com.mavent.dev.dto.expenses.ExpenseCreateRequestDTO;
import com.mavent.dev.dto.expenses.ExpenseResponseDTO;
import com.mavent.dev.dto.expenses.ExpenseUpdateDTO;
import com.mavent.dev.entity.ExpenseAttachments;
import com.mavent.dev.entity.Expenses;
import com.mavent.dev.mapper.ExpensesMapper;
import com.mavent.dev.repository.ExpenseAttachmentsRepository;
import com.mavent.dev.repository.ExpensesRepository;
import com.mavent.dev.service.ExpenseService;
import com.mavent.dev.service.globalservice.CloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImplement implements ExpenseService {

    private static final String EXPENSE_CONTAINER = "expense-attachments";
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE,
            MediaType.IMAGE_GIF_VALUE,
            "image/webp"
    );

    @Autowired
    private ExpensesRepository expensesRepository;
    
    @Autowired
    private ExpenseAttachmentsRepository attachmentsRepository;
    
    @Autowired
    private CloudService cloudService;

    @Override
    @Transactional
    public ExpenseResponseDTO createExpenseRequest(ExpenseCreateRequestDTO dto) {

         if (dto.getBudgetId() <= 0) {
            dto.setBudgetId(null);
        }

        Expenses expense = ExpensesMapper.toEntity(dto);
        expense.setCreatedAt(LocalDateTime.now());
        

        Expenses savedExpense = expensesRepository.save(expense);
        
        return ExpensesMapper.toDTO(savedExpense, new ArrayList<>());
    }
    
    @Override
    @Transactional
    public ExpenseResponseDTO createExpenseRequestWithAttachments(ExpenseCreateRequestDTO dto, List<MultipartFile> files) throws IOException {

         if (dto.getBudgetId() <= 0) {
            dto.setBudgetId(null);
        }

        Expenses expense = ExpensesMapper.toEntity(dto);
        expense.setCreatedAt(LocalDateTime.now());
     
        Expenses savedExpense = expensesRepository.save(expense);
        
        // Debugging log
//        System.out.println("ExpenseService: Processing files");
//        System.out.println("Files is null? " + (files == null));
//        System.out.println("Files is empty? " + (files != null && files.isEmpty()));
        
        if (files != null) {
            System.out.println("Number of files: " + files.size());
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
//                System.out.println("File " + i + " name: " + file.getOriginalFilename());
//                System.out.println("File " + i + " type: " + file.getContentType());
//                System.out.println("File " + i + " size: " + file.getSize());
//                System.out.println("File " + i + " is allowed type? " + ALLOWED_IMAGE_TYPES.contains(file.getContentType()));
            }
        }

        List<ExpenseAttachments> attachments = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            try {
                attachments = uploadAttachments(savedExpense.getExpenseId(), files);
//                System.out.println("Successfully uploaded " + attachments.size() + " attachments");
            } catch (Exception e) {
//                System.err.println("Error uploading attachments: " + e.getMessage());
                e.printStackTrace();
                // Không throw exception để vẫn lưu được expense
            }
        } else {
//            System.out.println("No files to upload");
        }
        
        return ExpensesMapper.toDTO(savedExpense, attachments);
    }
    
    @Override
    @Transactional
    public List<ExpenseAttachments> uploadAttachments(int expenseId, List<MultipartFile> files) throws IOException {
        List<ExpenseAttachments> savedAttachments = new ArrayList<>();

        Expenses expense = expensesRepository.findByExpenseId(expenseId);
        if (expense == null) {
            throw new RuntimeException("Expense not found with ID: " + expenseId);
        }
        
//        System.out.println("uploadAttachments: Starting to process " + files.size() + " files");
        
        // Filter out non-image files
        List<MultipartFile> validFiles = files.stream()
                .filter(file -> {
                    boolean isValid = ALLOWED_IMAGE_TYPES.contains(file.getContentType());
//                    System.out.println("File: " + file.getOriginalFilename() +
//                                      ", Type: " + file.getContentType() +
//                                      ", Valid: " + isValid);
                    return isValid;
                })
                .toList();
        
        System.out.println("Valid files count: " + validFiles.size() + " out of " + files.size());
                
        if (validFiles.isEmpty()) {
            throw new RuntimeException("No valid image files were provided. Allowed types: JPEG, PNG, GIF, WebP");
        }
        
        for (MultipartFile file : validFiles) {
            // Upload the file to cloud storage
            String fileUrl = cloudService.uploadFile(file, EXPENSE_CONTAINER);
            
            // Create and save the attachment
            ExpenseAttachments attachment = ExpenseAttachments.builder()
                    .expenseId(expenseId)
                    .fileUrl(fileUrl)
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .uploadedAt(LocalDateTime.now())
                    .build();
            
            ExpenseAttachments savedAttachment = attachmentsRepository.save(attachment);
            savedAttachments.add(savedAttachment);
        }
        
        return savedAttachments;
    }

    @Override
    @Transactional
    public ExpenseResponseDTO updateExpenseStatus(ExpenseUpdateDTO dto) {
        // Find the expense by ID
        Expenses expense = expensesRepository.findByExpenseId(dto.getExpenseId());
        if (expense == null) {
            throw new RuntimeException("Expense not found with ID: " + dto.getExpenseId());
        }
        
        // Update the expense status
        expense.setStatus(Expenses.Status.valueOf(dto.getStatus().name()));
        expense.setApprovedByAccountId(dto.getApprovedByAccountId());
        expense.setResponseContent(dto.getResponseContent());
        expense.setUpdatedAt(LocalDateTime.now());
        
        Expenses updatedExpense = expensesRepository.save(expense);
        

        List<ExpenseAttachments> attachments = attachmentsRepository.findAllByExpenseId(updatedExpense.getExpenseId());
        
        return ExpensesMapper.toDTO(updatedExpense, attachments);
    }

    @Override
    public List<ExpenseResponseDTO> getExpensesByEventId(int eventId) {
        List<Expenses> expenses = expensesRepository.findByEventId(eventId);
        
        return expenses.stream()
                .map(expense -> {
                    List<ExpenseAttachments> attachments = attachmentsRepository.findAllByExpenseId(expense.getExpenseId());
                    return ExpensesMapper.toDTO(expense, attachments);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpenseResponseDTO> getExpensesByEventIdAndAccountId(int eventId, int accountId) {
        List<Expenses> expenses = expensesRepository.findByEventIdAndCreatedByAccountId(eventId, accountId);
        
        return expenses.stream()
                .map(expense -> {
                    List<ExpenseAttachments> attachments = attachmentsRepository.findAllByExpenseId(expense.getExpenseId());
                    return ExpensesMapper.toDTO(expense, attachments);
                })
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseResponseDTO getExpenseById(int expenseId) {
        // Find the expense by ID
        Expenses expense = expensesRepository.findByExpenseId(expenseId);
        if (expense == null) {
            throw new RuntimeException("Expense not found with ID: " + expenseId);
        }
        
        // Get attachments
        List<ExpenseAttachments> attachments = attachmentsRepository.findAllByExpenseId(expense.getExpenseId());
        
        return ExpensesMapper.toDTO(expense, attachments);
    }
}
