package com.mavent.dev.dto.expenses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseResponseDTO {
    private Integer expenseId;
    private int eventId;
    private int categoryId;
    private String categoryName;
    private int departmentId;
    private String departmentName;
    private BigInteger amount;
    private String title;
    private String note;
    private String status;
    private int createdByAccountId;
    private String createdByFullName;
    private Integer approvedByAccountId;

    private String responseContent;
    private String createdAt;
    private String updatedAt;
    private List<ExpenseAttachmentsDTO> attachments;
}
