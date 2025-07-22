// src/main/java/com/mavent/dev/service/IncomeService.java
package com.mavent.dev.service;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.dto.IncomeRequestDTO; // Thêm import này

import java.util.List;

public interface IncomeService {
    IncomeResponseDTO getIncomeOverviewForEvent(Integer eventId, String dateRange);

    List<IncomeResponseDTO.IncomeEntryDTO> getIncomesListByEventId(Integer eventId);

    // Phương thức MỚI: Thêm khoản thu nhập mới
    IncomeResponseDTO.IncomeEntryDTO createIncome(IncomeRequestDTO incomeRequestDTO);

    // Phương thức MỚI: Cập nhật khoản thu nhập hiện có
    IncomeResponseDTO.IncomeEntryDTO updateIncome(Integer incomeId, IncomeRequestDTO incomeRequestDTO);
}