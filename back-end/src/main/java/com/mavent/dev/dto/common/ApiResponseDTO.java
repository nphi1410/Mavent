package com.mavent.dev.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic DTO for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseDTO<T> {
    
    private Boolean success;
    private String message;
    private T data;
    private String timestamp;
    
    // Manual Builder implementation
    public static <T> Builder<T> builder() {
        return new Builder<>();
    }
    
    public static class Builder<T> {
        private final ApiResponseDTO<T> dto = new ApiResponseDTO<>();
        
        public Builder<T> success(Boolean success) {
            dto.success = success;
            return this;
        }
        
        public Builder<T> message(String message) {
            dto.message = message;
            return this;
        }
        
        public Builder<T> data(T data) {
            dto.data = data;
            return this;
        }
        
        public Builder<T> timestamp(String timestamp) {
            dto.timestamp = timestamp;
            return this;
        }
        
        public ApiResponseDTO<T> build() {
            return dto;
        }
    }
    
    public static <T> ApiResponseDTO<T> success(T data) {
        return ApiResponseDTO.<T>builder()
                .success(true)
                .data(data)
                .timestamp(java.time.Instant.now().toString())
                .build();
    }
    
    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return ApiResponseDTO.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(java.time.Instant.now().toString())
                .build();
    }
    
    public static <T> ApiResponseDTO<T> error(String message) {
        return ApiResponseDTO.<T>builder()
                .success(false)
                .message(message)
                .timestamp(java.time.Instant.now().toString())
                .build();
    }
}
