package com.mavent.dev.dto.expenses;

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
    private String status;
    private Integer approvedByAccountId;
    private String responseContent;
}
