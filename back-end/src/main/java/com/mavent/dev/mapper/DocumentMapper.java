
package com.mavent.dev.mapper;

import com.mavent.dev.dto.document.DocumentRequestDTO;
import com.mavent.dev.dto.document.DocumentResponseDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Department;
import com.mavent.dev.entity.Document;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DocumentMapper {    public static DocumentResponseDTO toResponseDTO(Document document, Department department, Account uploader) {
        // For department name, we have these cases:
        // 1. If department exists, use the department name (this should now include user's event department)
        // 2. If system role is SUPER_ADMIN, show "Admin"
        // 3. Otherwise show null (will be displayed as "No Department")
        String departmentName;
        
        if (department != null) {
            departmentName = department.getName();
        } else if (uploader != null && uploader.getSystemRole() == Account.SystemRole.SUPER_ADMIN) {
            departmentName = "Admin";
        } else {
            departmentName = null;
        }
        
        String uploaderName = uploader != null ?
                uploader.getFullName() :
                "Unknown";

        // Extract file name from path for potential future use
        String fileName = document.getFilePath() != null ?
                document.getFilePath().substring(document.getFilePath().lastIndexOf("/") + 1) : null;

        return DocumentResponseDTO.builder()
                .documentId(document.getDocumentId())
                .eventId(document.getEventId())
                .departmentId(document.getDepartmentId())
                .departmentName(departmentName)
                .uploaderAccountId(document.getUploaderAccountId())
                .uploaderName(uploaderName)
                .title(document.getTitle())
                .filePath(document.getFilePath()).fileUrl(document.getFilePath()) // Use same URL for now, preview endpoint will generate SAS token when needed
                .fileType(document.getFileType())
                .description(document.getDescription())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .fileSize(0L) // Will update this in the service
                .fileSizeFormatted("Pending")
                .build();
    }

    public static Document toEntity(DocumentRequestDTO requestDTO, Integer uploaderAccountId, String filePath, String fileType) {
        return Document.builder()
                .eventId(requestDTO.getEventId())
                .departmentId(requestDTO.getDepartmentId())
                .uploaderAccountId(uploaderAccountId)
                .title(requestDTO.getTitle())
                .filePath(filePath)
                .fileType(fileType)
                .description(requestDTO.getDescription())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static List<DocumentResponseDTO> toResponseDTOList(
            List<Document> documents,
            Map<Integer, Department> departmentMap,
            Map<Integer, Account> accountMap) {

        return documents.stream()
                .map(doc -> {
                    Department dept = doc.getDepartmentId() != null ?
                            departmentMap.get(doc.getDepartmentId()) : null;
                    Account acc = doc.getUploaderAccountId() != null ?
                            accountMap.get(doc.getUploaderAccountId()) : null;
                    return toResponseDTO(doc, dept, acc);
                })
                .collect(Collectors.toList());
    }
}