package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseByCategoryDTO {
    private Integer categoryId; // Giữ nguyên Integer
    private String categoryName;
    private BigInteger totalAmount;
}