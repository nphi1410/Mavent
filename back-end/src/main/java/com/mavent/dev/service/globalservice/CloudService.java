package com.mavent.dev.service.globalservice;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudService {
    String uploadFile(MultipartFile file, String containerName) throws IOException;
    byte[] downloadFile(String blobName, String containerName) throws IOException;
    boolean deleteFile(String blobName, String containerName);
    String getFileUrl(String blobName, String containerName);

}
