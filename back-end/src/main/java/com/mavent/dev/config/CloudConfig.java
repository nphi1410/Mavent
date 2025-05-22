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
        AwsBasicCredentials credentials = AwsBasicCredentials.create("0057c6c9b9fd1c70000000002", "K005NcntKSbKUC7EA1cAe1BY54lTRyo");

        this.s3Client = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .endpointOverride(URI.create("https://s3.us-east-005.backblazeb2.com"))
                .region(Region.US_WEST_2) // Use any dummy region; Backblaze doesn't validate it
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .build();
    }

    public void uploadFile() {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket("Mavent")
                .key("images/group.jpg")
                .build();
    System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        s3Client.putObject(request, Paths.get("C:/Users/AD/Downloads/10.jpg"));
    }
}

