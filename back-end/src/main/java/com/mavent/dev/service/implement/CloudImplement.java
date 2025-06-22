package com.mavent.dev.service.implement;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.mavent.dev.service.globalservice.CloudService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class CloudImplement implements CloudService {

    private String accountName = System.getenv("AZURE_STORAGE_ACCOUNT_NAME");
    private String accountKey = System.getenv("AZURE_STORAGE_ACCOUNT_KEY");

    private BlobContainerClient getContainerClient(String containerName) {
        // Create connection string from properties
        String connectionString = String.format(
                "DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s;EndpointSuffix=core.windows.net",
                accountName, accountKey);

        // Create the BlobServiceClient
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        // Get or create container if it doesn't exist
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        if (!containerClient.exists()) {
            containerClient.create();
        }

        return containerClient;
    }

    @Override
    public String uploadFile(MultipartFile file, String containerName) throws IOException {
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".dat";
        String blobName = UUID.randomUUID() + extension;

        // Get container client
        BlobContainerClient containerClient = getContainerClient(containerName);

        // Get blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Upload the file
        blobClient.upload(file.getInputStream(), file.getSize(), true);

        BlobHttpHeaders headers = new BlobHttpHeaders()
                .setContentType(file.getContentType())               // e.g. "image/jpeg"
                .setContentDisposition(
                        "inline; filename=\"" + file.getOriginalFilename() + "\""
                );  // ép browser chỉ hiển thị, không download

        blobClient.setHttpHeaders(headers);
        // Return the URL of the uploaded blob
        return blobClient.getBlobUrl();
    }

    @Override
    public String uploadFileWithContentDisposition(MultipartFile file, String containerName, String contentDisposition) throws IOException {
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".dat";
        String blobName = UUID.randomUUID() + extension;

        // Get container client
        BlobContainerClient containerClient = getContainerClient(containerName);

        // Get blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Upload the file
        blobClient.upload(file.getInputStream(), file.getSize(), true);

        // Set HTTP headers với content disposition được cung cấp
        BlobHttpHeaders headers = new BlobHttpHeaders()
                .setContentType(file.getContentType())
                .setContentDisposition(contentDisposition);

        blobClient.setHttpHeaders(headers);
        
        // Return the URL of the uploaded blob
        return blobClient.getBlobUrl();
    }

    @Override
    public byte[] downloadFile(String blobName, String containerName) throws IOException {
        // Get container client
        BlobContainerClient containerClient = getContainerClient(containerName);

        // Get blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Check if blob exists
        if (!blobClient.exists()) {
            throw new IOException("File not found: " + blobName);
        }

        // Download blob to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        blobClient.downloadStream(outputStream);
        return outputStream.toByteArray();
    }

    @Override
    public boolean deleteFile(String blobName, String containerName) {
        try {
            // Get container client
            BlobContainerClient containerClient = getContainerClient(containerName);

            // Get blob client
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            // Check if blob exists before deleting
            if (!blobClient.exists()) {
                return false;
            }

            // Delete the blob
            blobClient.delete();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getFileUrl(String blobName, String containerName) {
        // Get container client
        BlobContainerClient containerClient = getContainerClient(containerName);

        // Get blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Return the URL
        return blobClient.getBlobUrl();
    }
    
    @Override
    public String generateSasUrl(String blobName, String containerName, int expiryMinutes) {
        // Get container client
        BlobContainerClient containerClient = getContainerClient(containerName);
        
        // Get blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        
        if (!blobClient.exists()) {
            throw new IllegalArgumentException("Blob không tồn tại: " + blobName);
        }
        
        // Set SAS expiry time
        OffsetDateTime expiryTime = OffsetDateTime.now().plusMinutes(expiryMinutes);
        
        // Create SAS permissions (read-only)
        BlobSasPermission permissions = new BlobSasPermission()
            .setReadPermission(true);
        
        // Generate SAS token
        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(expiryTime, permissions);
        String sasToken = blobClient.generateSas(sasValues);
        
        // Return the full SAS URL
        return blobClient.getBlobUrl() + "?" + sasToken;
    }
    
    @Override
    public String determineContentType(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "application/octet-stream";
        }
        
        String extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        
        switch (extension) {
            case ".pdf": return "application/pdf";
            case ".doc": return "application/msword";
            case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".xls": return "application/vnd.ms-excel";
            case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case ".ppt": return "application/vnd.ms-powerpoint";
            case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case ".txt": return "text/plain";
            case ".csv": return "text/csv";
            case ".json": return "application/json";
            case ".jpg": case ".jpeg": return "image/jpeg";
            case ".png": return "image/png";
            case ".gif": return "image/gif";
            case ".svg": return "image/svg+xml";
            default: return "application/octet-stream";
        }
    }

    @Override
    public long getFileSize(String blobName, String containerName) {
        try {
            // Get container client
            BlobContainerClient containerClient = getContainerClient(containerName);

            // Get blob client
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            // Check if blob exists
            if (!blobClient.exists()) {
                return 0L;
            }

            // Get blob properties and return content length
            return blobClient.getProperties().getBlobSize();
        } catch (Exception e) {
            return 0L;
        }
    }
}
