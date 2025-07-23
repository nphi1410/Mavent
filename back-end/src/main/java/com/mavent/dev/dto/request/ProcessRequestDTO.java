package com.mavent.dev.dto.request;

import lombok.Data;

@Data
public class ProcessRequestDTO {
    private String status; // "APPROVED" hoặc "REJECTED"
    private String responseContent; // Ghi chú của người xử lý
    private Integer responseByAccountId; // ID người xử lý
}