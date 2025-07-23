package com.mavent.dev.dto.expenses;


import com.mavent.dev.entity.ExpenseAttachments;
import com.mavent.dev.entity.Expenses;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.time.LocalDate;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseCreateRequestDTO {
    private int eventId;
    private Integer budgetId;

    private int categoryId;
    private int departmentId;
    private BigInteger amount;
    private String title;
    private String note;

    private List<ExpenseAttachments> expenseAttachmentList; //Considering String fileUrl for simplicity

    private LocalDate paymentDate;
    private String paymentMethod;
    private Expenses.Status status;
    private int createdByAccountId;
    private int approvedByAccountId;

    private String responseContent;
}
