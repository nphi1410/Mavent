package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventTotalExpenseDTO {
    private Integer eventId; // Giữ nguyên Integer
    private BigInteger totalAmount;
}