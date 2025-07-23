package com.mavent.dev.dto;


import com.mavent.dev.entity.Expenses;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryByStatusDTO {
    private Expenses.Status status;
    private Long count;
}