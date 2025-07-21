// src/main/java/com/mavent/dev/mapper/IncomeMapper.java
package com.mavent.dev.mapper;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.entity.Income;
// import com.mavent.dev.entity.SourceType; // Xóa import này
import com.mavent.dev.entity.Income.SourceType; // Thêm import này

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class IncomeMapper {

    /**
     * Chuyển đổi một danh sách các đối tượng Income thành IncomeResponseDTO.
     * Đây là hàm chính để tổng hợp dữ liệu cho frontend.
     *
     * @param eventId ID của sự kiện
     * @param eventName Tên của sự kiện (có thể lấy từ một service khác hoặc truyền vào)
     * @param dateRange Phạm vi ngày của dữ liệu (ví dụ: "All Time", "Last 30 Days")
     * @param incomes Danh sách các đối tượng Income cần chuyển đổi
     * @return IncomeResponseDTO chứa tổng quan thu nhập
     */
    public static IncomeResponseDTO toIncomeResponseDTO(Integer eventId, String eventName, String dateRange, List<Income> incomes) {
        // Tính tổng doanh thu
        Long totalRevenue = incomes.stream()
                .mapToLong(Income::getAmount)
                .sum();

        // Tính tổng doanh thu theo từng loại nguồn
        Map<String, Long> revenueByType = incomes.stream()
                .collect(Collectors.groupingBy(
                        income -> income.getSourceType().name(), // Lấy tên String của Enum
                        Collectors.summingLong(Income::getAmount)
                ));

        // Chuyển đổi danh sách Income thành IncomeEntryDTO cho từng mục nhập
        IncomeResponseDTO.IncomeEntryDTO[] incomeEntries = incomes.stream()
                .map(income -> new IncomeResponseDTO.IncomeEntryDTO(
                        income.getIncomeId(),
                        income.getSourceType().name(), // Lấy tên String của Enum
                        income.getAmount(),
                        income.getReceivedDate(),
                        income.getTitle(),
                        income.getNotes()
                ))
                .toArray(IncomeResponseDTO.IncomeEntryDTO[]::new);

        // Xây dựng và trả về IncomeResponseDTO
        return new IncomeResponseDTO(
                eventId,
                totalRevenue,
                incomes.size(), // Số lượng nguồn thu
                revenueByType,
                eventName,
                dateRange,
                incomeEntries
        );
    }
}