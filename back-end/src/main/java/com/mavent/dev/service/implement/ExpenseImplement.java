package com.mavent.dev.service.implement;

import com.mavent.dev.dto.EventTotalExpenseDTO;
import com.mavent.dev.dto.ExpenseByCategoryDTO;
import com.mavent.dev.dto.ExpenseByDepartmentDTO;
import com.mavent.dev.dto.ExpenseSummaryByStatusDTO;
import com.mavent.dev.dto.PaymentMethodSummaryDTO; // BỔ SUNG DÒNG NÀY
import com.mavent.dev.dto.expenses.ExpenseCreateRequestDTO;
import com.mavent.dev.dto.expenses.ExpenseResponseDTO;
import com.mavent.dev.dto.expenses.ExpenseUpdateDTO;
import com.mavent.dev.entity.*;

import com.mavent.dev.mapper.ExpenseMapper;
import com.mavent.dev.mapper.ExpensesMapper;
import com.mavent.dev.repository.*;
import com.mavent.dev.service.ExpenseService;
import com.mavent.dev.service.globalservice.CloudService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseImplement implements ExpenseService {

    private final ExpensesRepository expensesRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final DepartmentRepository departmentRepository;
    private final ExpenseMapper expenseMapper;
    private static final String EXPENSE_CONTAINER = "expense-attachments";
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE,
            MediaType.IMAGE_GIF_VALUE,
            "image/webp"
    );



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

    /**
     * Retrieves the total expense for a specific event.
     * @param eventId The ID of the event.
     * @return EventTotalExpenseDTO containing the event ID and total amount.
     */
    @Override
    public EventTotalExpenseDTO getTotalExpenseByEventId(Integer eventId) {
        BigInteger totalAmount = expensesRepository.findTotalAmountByEventId(eventId);
        Long total = (totalAmount != null ? totalAmount : BigInteger.ZERO).longValue();
        return new EventTotalExpenseDTO(eventId, total);
    }


    /**
     * Retrieves expenses categorized by category for a specific event.
     * @param eventId The ID of the event.
     * @return A list of ExpenseByCategoryDTO, each containing category details and total amount for that category.
     */
    @Override
    public List<ExpenseByCategoryDTO> getExpensesByCategoryForEvent(Integer eventId) {
        List<Object[]> results = expensesRepository.findTotalAmountByCategoryForEvent(eventId);
        return results.stream()
                .map(row -> {
                    Integer categoryId = (Integer) row[0];
                    BigInteger totalAmount = (BigInteger) row[1];
                    Optional<ExpenseCategories> category = expenseCategoryRepository.findByCategoryId(categoryId);
                    String categoryName = category.map(ExpenseCategories::getCategoryName).orElse("Unknown Category");
                    return new ExpenseByCategoryDTO(categoryId, categoryName, totalAmount);
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves expenses categorized by department for a specific event.
     * @param eventId The ID of the event.
     * @return A list of ExpenseByDepartmentDTO, each containing department details and total amount for that department.
     */
    @Override
    public List<ExpenseByDepartmentDTO> getExpensesByDepartmentForEvent(Integer eventId) {
        List<Object[]> results = expensesRepository.findTotalAmountByDepartmentForEvent(eventId);
        return results.stream()
                .map(row -> {
                    Integer departmentId = (Integer) row[0];
                    BigInteger totalAmount = (BigInteger) row[1];
                    Department departmentEntity = departmentRepository.findByDepartmentId(departmentId);
                    Optional<Department> department = Optional.ofNullable(departmentEntity);
                    String departmentName = department.map(Department::getName).orElse("Unknown Department");
                    return new ExpenseByDepartmentDTO(departmentId, departmentName, totalAmount);
                })
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a summary of total expenses for each distinct payment method for a specific event.
     * @param eventId The ID of the event.
     * @return A list of PaymentMethodSummaryDTO, each containing payment method and its total amount.
     */
    @Override
    public List<PaymentMethodSummaryDTO> getPaymentMethodSummariesByEventId(Integer eventId) { // THAY ĐỔI Ở ĐÂY
        return expensesRepository.findTotalAmountByPaymentMethodForEvent(eventId); // THAY ĐỔI Ở ĐÂY
    }


    /**
     * Retrieves the count of expenses grouped by their status.
     * @return A list of ExpenseSummaryByStatusDTO, each containing a status and the count of expenses with that status.
     */
    @Override
    public List<ExpenseSummaryByStatusDTO> getExpenseCountByStatusForEvent(Integer eventId) {
        List<Object[]> results = expensesRepository.countExpensesByStatusForEvent(eventId);
        return results.stream()
                .map(row -> new ExpenseSummaryByStatusDTO((Expenses.Status) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }
}