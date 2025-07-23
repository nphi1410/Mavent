package com.mavent.dev.dto.expenses;

import com.mavent.dev.entity.Expenses;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseUpdateDTO {
    private Integer expenseId;
    private Expenses.Status status;
    private Integer approvedByAccountId;
    private String responseContent;
}
