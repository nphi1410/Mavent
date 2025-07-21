// src/main/java/com/mavent/dev/controller/IncomeController.java
package com.mavent.dev.controller;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService incomeService;

    // Inject IncomeService thông qua constructor
    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    /**
     * Endpoint để lấy tổng quan thu nhập cho một sự kiện cụ thể.
     * Ví dụ URL: GET /api/income/overview/5?dateRange=all
     *
     * @param eventId ID của sự kiện.
     * @param dateRange (Tùy chọn) Phạm vi ngày để lọc dữ liệu ("all", "30", "7", "today"). Mặc định là "all".
     * @return ResponseEntity chứa IncomeResponseDTO hoặc mã lỗi nếu không tìm thấy.
     */
    @GetMapping("/overview/{eventId}")
    public ResponseEntity<IncomeResponseDTO> getIncomeOverview(
            @PathVariable Integer eventId, // Đổi từ Long sang Integer
            @RequestParam(name = "dateRange", defaultValue = "all") String dateRange) {
        IncomeResponseDTO incomeOverview = incomeService.getIncomeOverviewForEvent(eventId, dateRange);
        return ResponseEntity.ok(incomeOverview);
    }
}