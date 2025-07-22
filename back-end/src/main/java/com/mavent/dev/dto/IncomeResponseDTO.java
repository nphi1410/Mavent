package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data // Tự động tạo getters, setters, toString, equals, hashCode
@NoArgsConstructor // Tự động tạo constructor không đối số
@AllArgsConstructor // Tự động tạo constructor với tất cả các trường
public class IncomeResponseDTO {
    private Integer eventId;
    private Long totalRevenue; // Đã đổi từ BigDecimal sang Long
    private int numberOfSources;
    private Map<String, Long> revenueByType; // Map của loại nguồn đến tổng số tiền (Đã đổi từ BigDecimal sang Long)
    private String selectedEventName;
    private String dateRange;
    private IncomeEntryDTO[] incomeEntries; // Mảng các mục nhập thu nhập riêng lẻ

    // Nested DTO cho các mục nhập thu nhập riêng lẻ
    @Data // Tự động tạo getters, setters, toString, equals, hashCode
    @NoArgsConstructor // Tự động tạo constructor không đối số
    @AllArgsConstructor // Tự động tạo constructor với tất cả các trường
    public static class IncomeEntryDTO {
        private Integer incomeId;
        private String type; // Ánh xạ với sourceType
        private Long amount; // Đã đổi từ BigDecimal sang Long
        private LocalDate date; // Ánh xạ với receivedDate
        private String source; // Ánh xạ với title hoặc description
        private String notes;
    }
}