package com.mavent.dev.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponseDTO {
    private Integer documentId;
    private Integer eventId;
    private Integer departmentId;
    private String departmentName;
    private Integer uploaderAccountId;
    private String uploaderName; // Optional: include uploader name for display
    private String title;
    private String filePath;
    private String fileUrl;
    private String fileType;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long fileSize; // Raw file size in bytes
    private String fileSizeFormatted; // Human-readable file size (KB, MB, GB)
}
