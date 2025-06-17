package com.mavent.dev.controller;

import com.mavent.dev.service.globalservice.CloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cloud")
public class CloudController {

    private static final String DEFAULT_CONTAINER = "maventcontainer";

    @Autowired
    private CloudService cloudService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam(value = "container", required = false) String container) {
        try {
            String containerName = container != null ? container : DEFAULT_CONTAINER;
            String fileUrl = cloudService.uploadFile(file, containerName);

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

//    @GetMapping("/{container}/{blobName}")
//    public ResponseEntity<?> downloadFile(@PathVariable String container,
//                                          @PathVariable String blobName) {
//        try {
//            byte[] data = cloudService.downloadFile(blobName, container);
//            return ResponseEntity.ok()
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(data);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body("Error downloading file: " + e.getMessage());
//        }
//    }

    @GetMapping("/url/{container}/{blobName}")
    public ResponseEntity<?> getImageUrl(@PathVariable String container,
                                      @PathVariable String blobName) {
        try {
            String fileUrl = cloudService.getFileUrl(blobName, container);
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error retrieving file URL: " + e.getMessage());
        }
    }
}
