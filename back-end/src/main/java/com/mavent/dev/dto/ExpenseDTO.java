package com.mavent.dev.dto;

import com.mavent.dev.entity.Expense;
import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDate;

@Data
public class ExpenseDTO {
    private Integer expenseId; // ĐÃ SỬA: Chuyển từ Long sang Integer
    private Integer eventId; // Giữ nguyên Integer
    private Integer budgetId; // ĐÃ SỬA: Chuyển từ Long sang Integer
    private Integer categoryId; // Giữ nguyên Integer
    private Integer departmentId; // Giữ nguyên Integer
    private BigInteger amount;
    private String note;
    private LocalDate paymentDate;
    private String paymentMethod;
    private Expense.Status status;
    private Integer createdByAccountId; // ĐÃ SỬA: Chuyển từ Long sang Integer
    private Integer approvedByAccountId; // ĐÃ SỬA: Chuyển từ Long sang Integer
}