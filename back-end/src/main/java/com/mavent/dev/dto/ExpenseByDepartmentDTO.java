package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseByDepartmentDTO {
    private Integer departmentId; // Giữ nguyên Integer
    private String departmentName;
    private BigInteger totalAmount;
}