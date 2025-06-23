package com.mavent.dev.service.globalservice;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudService {
    String uploadFile(MultipartFile file, String containerName) throws IOException;
    byte[] downloadFile(String blobName, String containerName) throws IOException;
    boolean deleteFile(String blobName, String containerName);
    String getFileUrl(String blobName, String containerName);
    
    /**
     * Upload file với content disposition tùy chỉnh
     * @param file File cần upload
     * @param containerName Tên container lưu trữ
     * @param contentDisposition Content-Disposition header (e.g., "attachment; filename=\"file.pdf\"")
     * @return URL của blob đã upload
     */
    String uploadFileWithContentDisposition(MultipartFile file, String containerName, String contentDisposition) throws IOException;
    
    /**
     * Tạo SAS URL với thời hạn giới hạn
     * @param blobName Tên blob
     * @param containerName Tên container lưu trữ
     * @param expiryMinutes Thời hạn URL tính bằng phút
     * @return SAS URL với thời hạn hữu hạn
     */
    String generateSasUrl(String blobName, String containerName, int expiryMinutes);
    
    /**
     * Xác định content type dựa trên tên file
     * @param fileName Tên file cần xác định content type
     * @return Content type phù hợp
     */
    String determineContentType(String fileName);

    /**
     * Lấy kích thước của file
     * @param blobName Tên blob
     * @param containerName Tên container lưu trữ
     * @return Kích thước file (byte)
     */
    long getFileSize(String blobName, String containerName);
}
