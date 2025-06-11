package com.mavent.dev.controller;

import com.mavent.dev.dto.ImageDTO;
import com.mavent.dev.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<ImageDTO>> getFiveImage(){
        return ResponseEntity.ok(documentService.getFiveImage());
    }
}
