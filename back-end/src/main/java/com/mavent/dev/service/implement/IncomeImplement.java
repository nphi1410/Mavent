// src/main/java/com/mavent/dev/service/impl/IncomeServiceImpl.java
package com.mavent.dev.service.implement;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.dto.superadmin.EventDTO;
import com.mavent.dev.entity.Income;
import com.mavent.dev.exception.ResourceNotFoundException;
import com.mavent.dev.mapper.IncomeMapper;
import com.mavent.dev.repository.IncomeRepository;
import com.mavent.dev.service.IncomeService;
import com.mavent.dev.service.EventService; // Import EventService
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional; // Import Optional

@Service
public class IncomeImplement implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final EventService eventService; // Thêm EventService

    // Inject IncomeRepository và EventService thông qua constructor
    public IncomeImplement(IncomeRepository incomeRepository, EventService eventService) {
        this.incomeRepository = incomeRepository;
        this.eventService = eventService; // Khởi tạo EventService
    }

    /**
     * Lấy dữ liệu tổng quan thu nhập cho một sự kiện cụ thể, có thể lọc theo phạm vi ngày.
     *
     * @param eventId ID của sự kiện.
     * @param dateRange Chuỗi chỉ định phạm vi ngày ("all", "30", "7", "today").
     * @return IncomeResponseDTO chứa thông tin tổng hợp về thu nhập.
     * @throws ResourceNotFoundException nếu không tìm thấy sự kiện hoặc không có dữ liệu thu nhập.
     */
    @Override
    public IncomeResponseDTO getIncomeOverviewForEvent(Integer eventId, String dateRange) { // Đổi từ Long sang Integer
        List<Income> incomes;
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        // Xử lý logic lọc theo dateRange
        switch (dateRange.toLowerCase()) {
            case "30": // 30 ngày qua
                startDate = endDate.minusDays(30);
                incomes = incomeRepository.findByEventIdAndReceivedDateBetween(eventId, startDate, endDate);
                break;
            case "7": // 7 ngày qua
                startDate = endDate.minusDays(7);
                incomes = incomeRepository.findByEventIdAndReceivedDateBetween(eventId, startDate, endDate);
                break;
            case "today": // Hôm nay
                startDate = endDate;
                incomes = incomeRepository.findByEventIdAndReceivedDateBetween(eventId, startDate, endDate);
                break;
            case "all": // Tất cả thời gian
            default:
                incomes = incomeRepository.findByEventId(eventId);
                break;
        }

        // Lấy tên sự kiện từ EventService
        EventDTO eventDTO = eventService.getEventById(eventId);
        if (eventDTO == null) { // Kiểm tra nếu không tìm thấy Event
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }
        String eventName = eventDTO.getName();

        // Kiểm tra nếu không có dữ liệu thu nhập cho sự kiện này
        if (incomes.isEmpty()) {
            // Nếu không có dữ liệu thu nhập, trả về DTO với các giá trị tổng bằng 0
            // và tên sự kiện đã lấy được.
            return IncomeMapper.toIncomeResponseDTO(eventId, eventName, dateRange, incomes);
        }

        // Chuyển đổi danh sách Income thành IncomeResponseDTO bằng Mapper
        return IncomeMapper.toIncomeResponseDTO(eventId, eventName, dateRange, incomes);
    }
}