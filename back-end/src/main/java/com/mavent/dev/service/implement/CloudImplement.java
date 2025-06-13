package com.mavent.dev.service.implement;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.mavent.dev.service.globalservice.CloudService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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
        String blobName = UUID.randomUUID().toString() + extension;

        // Get container client
        BlobContainerClient containerClient = getContainerClient(containerName);

        // Get blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Upload the file
        blobClient.upload(file.getInputStream(), file.getSize(), true);

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
}
