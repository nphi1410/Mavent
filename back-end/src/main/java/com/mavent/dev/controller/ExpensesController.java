package com.mavent.dev.controller;

import com.mavent.dev.dto.expenses.ExpenseCreateRequestDTO;
import com.mavent.dev.dto.expenses.ExpenseResponseDTO;
import com.mavent.dev.dto.expenses.ExpenseUpdateDTO;
import com.mavent.dev.entity.ExpenseAttachments;
import com.mavent.dev.entity.ExpenseCategories;
import com.mavent.dev.service.ExpenseCategoryService;
import com.mavent.dev.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/{eventId}/expenses")
public class ExpensesController {

    @Autowired
    private ExpenseService expenseService;
    
    @Autowired
    private ExpenseCategoryService categoryService;

    @GetMapping("/expense-categories")
    public ResponseEntity<List<ExpenseCategories>> getAllCategories() {
        List<ExpenseCategories> categories = categoryService.getAllExpenseCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> createExpenseRequest(
            @PathVariable int eventId,
            @RequestBody ExpenseCreateRequestDTO requestDTO) {

        requestDTO.setEventId(eventId);
        
        ExpenseResponseDTO response = expenseService.createExpenseRequest(requestDTO);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping(value = "/with-attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExpenseResponseDTO> createExpenseRequestWithAttachments(
            @PathVariable int eventId,
            @RequestPart("data") ExpenseCreateRequestDTO requestDTO,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {

        System.out.println("ExpensesController: createExpenseRequestWithAttachments called");
        System.out.println("Files parameter is null? " + (files == null));
        if (files != null) {
            System.out.println("Files size: " + files.size());
            for (int i = 0; i < files.size(); i++) {
                System.out.println("File " + i + " name: " + files.get(i).getOriginalFilename());
                System.out.println("File " + i + " size: " + files.get(i).getSize());
                System.out.println("File " + i + " content type: " + files.get(i).getContentType());
            }
        } else {
            System.out.println("WARNING: Files list is null - check Postman form setup");
        }

        requestDTO.setEventId(eventId);
        
        ExpenseResponseDTO response = expenseService.createExpenseRequestWithAttachments(requestDTO, files);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping(value = "/{expenseId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ExpenseAttachments>> addAttachmentsToExpense(
            @PathVariable int eventId,
            @PathVariable int expenseId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        
        System.out.println("addAttachmentsToExpense: Files count = " + (files != null ? files.size() : "null"));
        
        List<ExpenseAttachments> attachments = expenseService.uploadAttachments(expenseId, files);
        return ResponseEntity.ok(attachments);
    }

    @PutMapping("{expenseId}")
    public ResponseEntity<ExpenseResponseDTO> updateExpenseStatus(
            @PathVariable int eventId,
            @PathVariable int expenseId,
            @RequestBody ExpenseUpdateDTO updateDTO) {

        updateDTO.setExpenseId(expenseId);

        
        ExpenseResponseDTO response = expenseService.updateExpenseStatus(updateDTO);
        return ResponseEntity.ok(response);
    }
    

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDTO>> getExpensesByEventId(@PathVariable int eventId) {
        List<ExpenseResponseDTO> expenses = expenseService.getExpensesByEventId(eventId);
        return ResponseEntity.ok(expenses);
    }
    

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<ExpenseResponseDTO>> getExpensesByEventIdAndAccountId(
            @PathVariable int eventId,
            @PathVariable int accountId) {
        
        List<ExpenseResponseDTO> expenses = expenseService.getExpensesByEventIdAndAccountId(eventId, accountId);
        return ResponseEntity.ok(expenses);
    }
    

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponseDTO> getExpenseById(
            @PathVariable int eventId,
            @PathVariable int expenseId) {
        
        ExpenseResponseDTO expense = expenseService.getExpenseById(expenseId);
        return ResponseEntity.ok(expense);
    }
    
}
