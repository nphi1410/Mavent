package com.mavent.dev.dto;

import com.mavent.dev.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryByStatusDTO {
    private Expense.Status status;
    private Long count;
}