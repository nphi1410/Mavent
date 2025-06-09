package com.mavent.dev.config;

import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Paths;

public class CloudConfig {

    private final S3Client s3Client;

    public CloudConfig() {
        String accessKey = System.getenv("AWS_ACCESS_KEY");
        String secretKey = System.getenv("AWS_SECRET_KEY");
        String endpoint = System.getenv("AWS_ENDPOINT");
        String region = System.getenv("AWS_REGION");
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);

        this.s3Client = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .build();
    }

//    public void uploadImage(String localFilePath, String fileName) {
//        String bucket = System.getenv("AWS_BUCKET_NAME");
//        PutObjectRequest request = PutObjectRequest.builder()
//                .bucket(bucket)
//                .key("images/group.jpg")
//                .build();
//        s3Client.putObject(request, Paths.get("C:/Users/AD/Downloads/10.jpg"));
//    }

    public void uploadMultipartFile(MultipartFile file, String type) throws IOException {
        String bucket = System.getenv("AWS_BUCKET_NAME");
        String keyName = type + "/" + file.getOriginalFilename();

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(keyName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
    }

    // Download file as byte array
    public byte[] getFileBytes(String keyName) throws IOException {
        String bucket = System.getenv("AWS_BUCKET_NAME");
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(keyName)
                .build();

        try (ResponseInputStream<?> s3Object = s3Client.getObject(getObjectRequest)) {
            return s3Object.readAllBytes();
        } catch (S3Exception e) {
            // Handle exceptions (file not found, access denied, etc.)
            throw new IOException("Failed to get file from S3: " + e.awsErrorDetails().errorMessage(), e);
        }

        
    }
}