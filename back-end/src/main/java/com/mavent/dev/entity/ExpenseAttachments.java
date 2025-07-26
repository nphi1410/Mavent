package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "expense_attachments")
public class ExpenseAttachments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_attachment_id")
    private Integer expenseAttachmentId;

    @Column(name = "expense_id", nullable = false)
    private Integer expenseId;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "file_type")
    private String fileType;

    @CreationTimestamp
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column( name = "attachment_type")
    private ExpenseAttachments.AttachmentType attachmentType;

    public enum AttachmentType {
        RECEIPT,
        EVIDENCE
    }
}
