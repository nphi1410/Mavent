// src/main/java/com/mavent/dev/controller/IncomeController.java
package com.mavent.dev.controller;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.dto.IncomeRequestDTO; // Thêm import này
import com.mavent.dev.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "http://localhost:3000") // Đảm bảo CORS được cấu hình đúng cho frontend
public class IncomeController {

    private final IncomeService incomeService;

    @Autowired
    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    /**
     * Lấy tổng quan thu nhập cho một sự kiện cụ thể.
     * Ví dụ: GET /api/income/overview/5?dateRange=all
     * @param eventId ID của sự kiện.
     * @param dateRange Phạm vi ngày ("all", "30", "7", "today").
     * @return IncomeResponseDTO chứa tổng quan thu nhập.
     */
    @GetMapping("/overview/{eventId}")
    public ResponseEntity<IncomeResponseDTO> getIncomeOverview(@PathVariable Integer eventId,
                                                               @RequestParam(name = "dateRange", defaultValue = "all") String dateRange) {
        IncomeResponseDTO incomeOverview = incomeService.getIncomeOverviewForEvent(eventId, dateRange);
        return ResponseEntity.ok(incomeOverview);
    }

    /**
     * Lấy danh sách chi tiết các khoản thu nhập cho một sự kiện cụ thể.
     * Ví dụ: GET /api/income/event/{eventId}/list
     * @param eventId ID của sự kiện.
     * @return List<IncomeResponseDTO.IncomeEntryDTO> danh sách các mục nhập thu nhập.
     */
    @GetMapping("/event/{eventId}/list")
    public ResponseEntity<List<IncomeResponseDTO.IncomeEntryDTO>> getIncomesByEventId(@PathVariable Integer eventId) {
        List<IncomeResponseDTO.IncomeEntryDTO> incomesList = incomeService.getIncomesListByEventId(eventId);
        return ResponseEntity.ok(incomesList);
    }

    /**
     * Phương thức MỚI: Tạo một khoản thu nhập mới.
     * Ví dụ: POST /api/income
     * @param incomeRequestDTO Dữ liệu yêu cầu để tạo thu nhập.
     * @return IncomeResponseDTO.IncomeEntryDTO của khoản thu nhập đã tạo.
     */
    @PostMapping
    public ResponseEntity<IncomeResponseDTO.IncomeEntryDTO> createIncome(@RequestBody IncomeRequestDTO incomeRequestDTO) {
        IncomeResponseDTO.IncomeEntryDTO createdIncome = incomeService.createIncome(incomeRequestDTO);
        return new ResponseEntity<>(createdIncome, HttpStatus.CREATED);
    }

    /**
     * Phương thức MỚI: Cập nhật một khoản thu nhập hiện có.
     * Ví dụ: PUT /api/income/123
     * @param incomeId ID của khoản thu nhập cần cập nhật.
     * @param incomeRequestDTO Dữ liệu yêu cầu để cập nhật thu nhập.
     * @return IncomeResponseDTO.IncomeEntryDTO của khoản thu nhập đã cập nhật.
     */
    @PutMapping("/{incomeId}")
    public ResponseEntity<IncomeResponseDTO.IncomeEntryDTO> updateIncome(@PathVariable Integer incomeId,
                                                                         @RequestBody IncomeRequestDTO incomeRequestDTO) {
        IncomeResponseDTO.IncomeEntryDTO updatedIncome = incomeService.updateIncome(incomeId, incomeRequestDTO);
        return ResponseEntity.ok(updatedIncome);
    }
}