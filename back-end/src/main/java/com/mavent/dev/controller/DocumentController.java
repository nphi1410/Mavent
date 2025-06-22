package com.mavent.dev.controller;

import com.mavent.dev.dto.document.DocumentPreviewUrlDTO;
import com.mavent.dev.dto.document.DocumentRequestDTO;
import com.mavent.dev.dto.document.DocumentResponseDTO;
import com.mavent.dev.entity.Document;
import com.mavent.dev.service.DocumentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/latest")
    public ResponseEntity<List<Document>> getFiveImage() {
        return ResponseEntity.ok(documentService.getFiveImage());
    }

    @PostMapping
    public ResponseEntity<DocumentResponseDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @Valid @RequestPart("request") DocumentRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        
        // Extract account ID from authenticated user
        Integer accountId = Integer.parseInt(userDetails.getUsername());

        DocumentResponseDTO response = documentService.uploadDocument(file, requestDTO, accountId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByEvent(
            @PathVariable Integer eventId) {

        List<DocumentResponseDTO> documents = documentService.getDocumentsByEventId(eventId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/event/{eventId}/department/{departmentId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByDepartment(
            @PathVariable Integer eventId,
            @PathVariable Integer departmentId) {

        List<DocumentResponseDTO> documents = documentService.getDocumentsByDepartment(eventId, departmentId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentResponseDTO> getDocumentById(
            @PathVariable Integer documentId) {

        return documentService.getDocumentById(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{documentId}/preview")
    public ResponseEntity<DocumentPreviewUrlDTO> getPreviewUrl(
            @PathVariable Integer documentId) {

        DocumentPreviewUrlDTO previewUrl = documentService.generatePreviewUrl(documentId);
        return ResponseEntity.ok(previewUrl);
    }    @DeleteMapping("/{documentId}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Integer documentId) {

        try {
            boolean deleted = documentService.deleteDocument(documentId);

            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(false, "Document not found with ID: " + documentId, null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(false, "An error occurred while deleting the document: " + e.getMessage(), null));
        }
    }

    
    // Inner class for error responses
    @Data
    @AllArgsConstructor
    private static class ErrorResponse {
        private boolean success;
        private String message;
        private Object data;
    }
}
