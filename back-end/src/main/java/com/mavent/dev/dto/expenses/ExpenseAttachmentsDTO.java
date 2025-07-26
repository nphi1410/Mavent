package com.mavent.dev.dto.expenses;

import com.mavent.dev.entity.ExpenseAttachments;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseAttachmentsDTO {
    private int attachmentId;
    private int expenseId;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private ExpenseAttachments.AttachmentType attachmentType;
    private LocalDateTime uploadedAt;
}
