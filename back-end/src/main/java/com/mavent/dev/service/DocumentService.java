package com.mavent.dev.service;

import com.mavent.dev.dto.document.DocumentPreviewUrlDTO;
import com.mavent.dev.dto.document.DocumentRequestDTO;
import com.mavent.dev.dto.document.DocumentResponseDTO;
import com.mavent.dev.entity.Document;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface DocumentService {
    List<Document> getFiveImage(); // Existing method

    // New methods
    DocumentResponseDTO uploadDocument(MultipartFile file, DocumentRequestDTO request, Integer uploaderAccountId) throws IOException;
    List<DocumentResponseDTO> getDocumentsByEventId(Integer eventId);
    List<DocumentResponseDTO> getDocumentsByDepartment(Integer eventId, Integer departmentId);
    Optional<DocumentResponseDTO> getDocumentById(Integer documentId);
    DocumentPreviewUrlDTO generatePreviewUrl(Integer documentId);
    boolean deleteDocument(Integer documentId);


    // Thêm phương thức mới cho upload document
    // Cho phép kiểm soát Content-Disposition
    String uploadFileWithCustomDisposition(
            MultipartFile file,
            String containerName,
            String contentDisposition
    ) throws IOException;

    DocumentResponseDTO updateDocument(Integer documentId, DocumentRequestDTO request);
}
