package com.mavent.dev.mapper;

import com.mavent.dev.dto.ExpenseDTO;

import com.mavent.dev.entity.Expenses;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public ExpenseDTO toDto(Expenses expense) {
        if (expense == null) {
            return null;
        }

        ExpenseDTO expenseDTO = new ExpenseDTO();
        expenseDTO.setExpenseId(expense.getExpenseId());
        expenseDTO.setEventId(expense.getEventId());
        expenseDTO.setBudgetId(expense.getBudgetId());
        expenseDTO.setCategoryId(expense.getCategoryId());
        expenseDTO.setDepartmentId(expense.getDepartmentId());
        expenseDTO.setAmount(expense.getAmount());
        expenseDTO.setNote(expense.getNote());
        expenseDTO.setPaymentDate(expense.getPaymentDate());
        expenseDTO.setStatus(expense.getStatus());
        expenseDTO.setPaymentMethod(expense.getPaymentMethod());
        expenseDTO.setCreatedByAccountId(expense.getCreatedByAccountId());
        expenseDTO.setApprovedByAccountId(expense.getApprovedByAccountId());

        return expenseDTO;
    }

    public Expenses toEntity(ExpenseDTO expenseDTO) {
        if (expenseDTO == null) {
            return null;
        }

        Expenses expense = new Expenses();
        expense.setExpenseId(expenseDTO.getExpenseId());
        expense.setEventId(expenseDTO.getEventId());
        expense.setBudgetId(expenseDTO.getBudgetId());
        expense.setCategoryId(expenseDTO.getCategoryId());
        expense.setDepartmentId(expenseDTO.getDepartmentId());
        expense.setAmount(expenseDTO.getAmount());
        expense.setNote(expenseDTO.getNote());
        expense.setPaymentDate(expenseDTO.getPaymentDate());
        expense.setStatus(expenseDTO.getStatus());
        expense.setPaymentMethod(expenseDTO.getPaymentMethod());
        expense.setCreatedByAccountId(expenseDTO.getCreatedByAccountId());
        expense.setApprovedByAccountId(expenseDTO.getApprovedByAccountId());

        return expense;
    }
}