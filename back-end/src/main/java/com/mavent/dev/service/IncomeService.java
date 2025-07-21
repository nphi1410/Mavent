// src/main/java/com/mavent/dev/service/IncomeService.java
package com.mavent.dev.service;

import com.mavent.dev.dto.IncomeResponseDTO;

public interface IncomeService {

    /**
     * Lấy dữ liệu tổng quan thu nhập cho một sự kiện cụ thể.
     *
     * @param eventId ID của sự kiện.
     * @param dateRange Lọc theo phạm vi ngày ("all", "30", "7", "today").
     * @return IncomeResponseDTO chứa tất cả thông tin thu nhập tổng hợp.
     */
    IncomeResponseDTO getIncomeOverviewForEvent(Integer eventId, String dateRange); // Đổi từ Long sang Integer
}