package com.mavent.dev.service.implement;

import com.mavent.dev.dto.document.DocumentPreviewUrlDTO;
import com.mavent.dev.dto.document.DocumentRequestDTO;
import com.mavent.dev.dto.document.DocumentResponseDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Department;
import com.mavent.dev.entity.Document;
import com.mavent.dev.mapper.DocumentMapper;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.repository.DocumentRepository;
import com.mavent.dev.service.DocumentService;
import com.mavent.dev.service.globalservice.CloudService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentImplement implements DocumentService {

    private final DocumentRepository documentRepository;
    private final AccountRepository accountRepository;
    private final DepartmentRepository departmentRepository;
    private final CloudService cloudService;

    @Value("${spring.cloud.azure.storage.blob.document-container:documents}")
    private String documentContainer;

    @Override
    public List<Document> getFiveImage() {
        return documentRepository.findTop5ByOrderByCreatedAtDesc();
    }    @Override
    @Transactional
    public DocumentResponseDTO uploadDocument(MultipartFile file, DocumentRequestDTO request, Integer uploaderAccountId) throws IOException {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        // Prepare content disposition for document (forcing download)
        String contentDisposition = "attachment; filename=\"" + file.getOriginalFilename() + "\"";

        // Upload file with appropriate content disposition
        String filePath = uploadFileWithCustomDisposition(file, documentContainer, contentDisposition);

        // Determine content type
        String fileType = cloudService.determineContentType(file.getOriginalFilename());

        // Create document entity
        Document document = DocumentMapper.toEntity(request, uploaderAccountId, filePath, fileType);
        document = documentRepository.save(document);

        // Get related data for response
        Account uploader = accountRepository.findById(uploaderAccountId).orElse(null);
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
          // Create response DTO
        DocumentResponseDTO responseDTO = DocumentMapper.toResponseDTO(document, department, uploader);
        
        // Set the file size if possible
        try {
            String blobName = getBlobNameFromUrl(filePath);
            long fileSize;
            
            if (blobName != null) {
                fileSize = cloudService.getFileSize(blobName, documentContainer);
            } else {
                // If blob name can't be extracted, use the original file size
                fileSize = file.getSize();
            }
            
            responseDTO.setFileSize(fileSize);
            responseDTO.setFileSizeFormatted(formatFileSize(fileSize));
        } catch (Exception e) {
            // If there's an error getting size from storage, use the original file size
            long fileSize = file.getSize();
            responseDTO.setFileSize(fileSize);
            responseDTO.setFileSizeFormatted(formatFileSize(fileSize));
        }
        
        return responseDTO;
    }

    @Override
    public List<DocumentResponseDTO> getDocumentsByEventId(Integer eventId) {
        List<Document> documents = documentRepository.findByEventId(eventId);
        return mapDocumentsToResponseDTOs(documents);
    }

    @Override
    public List<DocumentResponseDTO> getDocumentsByDepartment(Integer eventId, Integer departmentId) {
        List<Document> documents = documentRepository.findByEventIdAndDepartmentId(eventId, departmentId);
        return mapDocumentsToResponseDTOs(documents);
    }    @Override
    public Optional<DocumentResponseDTO> getDocumentById(Integer documentId) {
        return documentRepository.findById(documentId)
                .map(document -> {
                    Department department = document.getDepartmentId() != null ?
                            departmentRepository.findById(document.getDepartmentId()).orElse(null) : null;
                    Account uploader = accountRepository.findById(document.getUploaderAccountId()).orElse(null);
                    
                    DocumentResponseDTO responseDTO = DocumentMapper.toResponseDTO(document, department, uploader);
                      // Get file size if possible
                    if (document.getFilePath() != null) {
                        try {
                            String blobName = getBlobNameFromUrl(document.getFilePath());
                            if (blobName != null) {
                                long fileSize = cloudService.getFileSize(blobName, documentContainer);
                                responseDTO.setFileSize(fileSize);
                                responseDTO.setFileSizeFormatted(formatFileSize(fileSize));
                            }
                        } catch (Exception e) {
                            // If there's an error getting size, just continue with fileSize=0
                            responseDTO.setFileSizeFormatted("Unknown");
                        }
                    }
                    
                    return responseDTO;
                });
    }    @Override
    public DocumentPreviewUrlDTO generatePreviewUrl(Integer documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document không tồn tại: " + documentId));
        
        // Extract blob name from filePath
        String blobName = getBlobNameFromUrl(document.getFilePath());
        if (blobName == null) {
            throw new IllegalStateException("Không thể trích xuất blob name từ file path: " + document.getFilePath());
        }
        
        // Generate SAS URL with 30-minute expiration
        String sasUrl = cloudService.generateSasUrl(blobName, documentContainer, 30);
        
        // Determine if this is a viewable document type
        boolean isViewable = isViewableContentType(document.getFileType());
        
        return DocumentPreviewUrlDTO.builder()
                .sasUrl(sasUrl)
                .contentType(document.getFileType())
                .fileName(document.getTitle() != null ? document.getTitle() : blobName)
                .isViewable(isViewable)
                .build();
    }
    
    // Helper method to determine if content type is viewable in browser
    private boolean isViewableContentType(String contentType) {
        if (contentType == null) return false;
        
        return contentType.startsWith("image/") || 
               contentType.equals("application/pdf") ||
               contentType.equals("text/plain") ||
               contentType.equals("text/html") ||
               contentType.equals("text/css") ||
               contentType.equals("text/javascript");
    }    @Override
    public boolean deleteDocument(Integer documentId) {
        return documentRepository.findById(documentId)
                .map(document -> {
                    try {
                        // Extract blob name from filePath using our helper method
                        String blobName = getBlobNameFromUrl(document.getFilePath());
                        
                        if (blobName == null) {
                            // Log the error and delete from database only
                            System.out.println("Could not extract blob name from URL: " + document.getFilePath());
                            documentRepository.delete(document);
                            return true;
                        }
                        
                        // Delete from storage
                        boolean deleted = cloudService.deleteFile(blobName, documentContainer);
                        
                        // Delete from database regardless of storage deletion success
                        // This ensures we don't keep references to files we can't access
                        documentRepository.delete(document);
                        return true;
                    } catch (Exception e) {
                        // Log the error
                        System.out.println("Error deleting document: " + e.getMessage());
                        // Still delete from database to prevent orphaned records
                        documentRepository.delete(document);
                        return true;
                    }
                })
                .orElse(false);
    }

    @Override
    public String uploadFileWithCustomDisposition(
            MultipartFile file,
            String containerName,
            String contentDisposition) throws IOException {
        return cloudService.uploadFileWithContentDisposition(file, containerName, contentDisposition);
    }    // Helper method to fetch related entities and map documents to DTOs    @Override
    public DocumentResponseDTO updateDocument(Integer documentId, DocumentRequestDTO request) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));

        // Update title if provided
        if (request.getTitle() != null && !request.getTitle().isEmpty()) {
            document.setTitle(request.getTitle());
        }
        
        // Update description if provided
        if (request.getDescription() != null) {
            document.setDescription(request.getDescription());
        }
        
        // Update updatedAt timestamp
        document.setUpdatedAt(LocalDateTime.now());
        
        // Save updated document
        Document savedDocument = documentRepository.save(document);
        
        // Get related entities for response
        Department department = null;
        if (savedDocument.getDepartmentId() != null) {
            department = departmentRepository.findById(savedDocument.getDepartmentId()).orElse(null);
        }
        
        Account uploader = null;
        if (savedDocument.getUploaderAccountId() != null) {
            uploader = accountRepository.findById(savedDocument.getUploaderAccountId()).orElse(null);
        }
        
        // Return mapped response DTO
        return DocumentMapper.toResponseDTO(savedDocument, department, uploader);
    }

    private List<DocumentResponseDTO> mapDocumentsToResponseDTOs(List<Document> documents) {
        // Get unique department IDs and account IDs
        List<Integer> departmentIds = documents.stream()
                .map(Document::getDepartmentId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        List<Integer> accountIds = documents.stream()
                .map(Document::getUploaderAccountId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        // Fetch departments and accounts in batch
        Map<Integer, Department> departmentMap = new HashMap<>();
        if (!departmentIds.isEmpty()) {
            departmentRepository.findAllById(departmentIds).forEach(dept ->
                    departmentMap.put(dept.getDepartmentId(), dept));
        }

        Map<Integer, Account> accountMap = new HashMap<>();
        if (!accountIds.isEmpty()) {
            accountRepository.findAllById(accountIds).forEach(acc ->
                    accountMap.put(acc.getAccountId(), acc));
        }
        
        // Map to DTOs
        List<DocumentResponseDTO> responseDTOs = DocumentMapper.toResponseDTOList(documents, departmentMap, accountMap);
        
        // Populate file sizes when possible
        for (int i = 0; i < documents.size(); i++) {
            Document document = documents.get(i);
            if (document.getFilePath() != null && i < responseDTOs.size()) {                try {
                    String blobName = getBlobNameFromUrl(document.getFilePath());
                    if (blobName != null) {
                        long fileSize = cloudService.getFileSize(blobName, documentContainer);
                        responseDTOs.get(i).setFileSize(fileSize);
                        responseDTOs.get(i).setFileSizeFormatted(formatFileSize(fileSize));
                    }
                } catch (Exception e) {
                    // Continue with fileSize=0 if there's an error
                    responseDTOs.get(i).setFileSizeFormatted("Unknown");
                }
            }
        }
        
        return responseDTOs;
    }
      // Helper method to extract blob name from URL
    private String getBlobNameFromUrl(String url) {
        try {
            if (url == null) return null;
            
            // Extract blob name from URL
            // URL format: https://storageaccount.blob.core.windows.net/containername/blobname
            int lastSlashIndex = url.lastIndexOf('/');
            if (lastSlashIndex != -1) {
                return url.substring(lastSlashIndex + 1);
            }
            
            // If no slash found, return the entire URL as a fallback
            // This is not ideal but better than returning null
            return url;
        } catch (Exception e) {
            System.out.println("Error extracting blob name from URL: " + e.getMessage());
            // If we get any exception, try using just the last part of the URL
            try {
                // Last resort: take everything after the last dot in the domain
                if (url != null && url.contains("windows.net/")) {
                    int startIndex = url.indexOf("windows.net/") + "windows.net/".length();
                    if (url.indexOf('/', startIndex) != -1) {
                        // Skip the container name as well
                        startIndex = url.indexOf('/', startIndex) + 1;
                    }
                    return url.substring(startIndex);
                }
            } catch (Exception ignored) {
                // Ignore any secondary exceptions
            }
            return null;
        }
    }
    
    // Helper method to format file size into human-readable format
    private String formatFileSize(long sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B";
        } else if (sizeInBytes < 1024 * 1024) {
            return String.format("%.2f KB", sizeInBytes / 1024.0);
        } else if (sizeInBytes < 1024 * 1024 * 1024) {
            return String.format("%.2f MB", sizeInBytes / (1024.0 * 1024.0));
        } else {
            return String.format("%.2f GB", sizeInBytes / (1024.0 * 1024.0 * 1024.0));
        }
    }
}
