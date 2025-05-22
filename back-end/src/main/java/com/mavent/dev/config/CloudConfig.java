package com.mavent.dev.config;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

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
                .region(Region.of(region)) // Use any dummy region; Backblaze doesn't validate it
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .build();
    }

    public void uploadFile() {
        String bucket = System.getenv("AWS_BUCKET_NAME");
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key("images/group.jpg")
                .build();
        s3Client.putObject(request, Paths.get("C:/Users/AD/Downloads/10.jpg"));
    }
}

