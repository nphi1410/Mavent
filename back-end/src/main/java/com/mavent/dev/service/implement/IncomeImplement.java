// src/main/java/com/mavent/dev/service/implement/IncomeImplement.java
package com.mavent.dev.service.implement;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.dto.IncomeRequestDTO;
import com.mavent.dev.entity.Income;
import com.mavent.dev.repository.IncomeRepository;
import com.mavent.dev.service.EventService; // Import EventService
import com.mavent.dev.service.IncomeService;
import com.mavent.dev.mapper.IncomeMapper;
import com.mavent.dev.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeImplement implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final EventService eventService; // Inject EventService

    @Autowired
    public IncomeImplement(IncomeRepository incomeRepository, EventService eventService) {
        this.incomeRepository = incomeRepository;
        this.eventService = eventService; // Initialize EventService
    }

    @Override
    public IncomeResponseDTO getIncomeOverviewForEvent(Integer eventId, String dateRange) {
        // Kiểm tra xem eventId có tồn tại không và lấy tên sự kiện
        String eventName = null;
        try {
            // Giả sử EventService có phương thức getEventNameById(eventId) hoặc getEventById(eventId).getName()
            // Cần EventService để lấy tên sự kiện
            eventName = eventService.getEventById(eventId).getName(); //
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }

        List<Income> incomes;

        // Xử lý logic lọc theo dateRange
        if ("all".equalsIgnoreCase(dateRange)) {
            incomes = incomeRepository.findByEventId(eventId); // Lấy tất cả thu nhập cho sự kiện
        } else {
            LocalDate endDate = LocalDate.now();
            LocalDate startDate;

            switch (dateRange) {
                case "30":
                    startDate = endDate.minusDays(30);
                    break;
                case "7":
                    startDate = endDate.minusDays(7);
                    break;
                case "today":
                    startDate = endDate;
                    break;
                default:
                    startDate = LocalDate.MIN; // Mặc định là tất cả nếu dateRange không hợp lệ
            }
            // Nếu dateRange là "today", findByEventIdAndReceivedDate sẽ đúng hơn
            if ("today".equalsIgnoreCase(dateRange)) {
                incomes = incomeRepository.findByEventIdAndReceivedDate(eventId, startDate); //
            } else {
                incomes = incomeRepository.findByEventIdAndReceivedDateBetween(eventId, startDate, endDate); //
            }
        }
        // Gọi IncomeMapper để chuyển đổi và tính toán dữ liệu tổng quan
        return IncomeMapper.toIncomeResponseDTO(eventId, eventName, dateRange, incomes); //
    }

    @Override
    public List<IncomeResponseDTO.IncomeEntryDTO> getIncomesListByEventId(Integer eventId) {
        List<Income> incomes = incomeRepository.findByEventId(eventId); //
        // Sử dụng stream để chuyển đổi từng Income entity sang IncomeEntryDTO
        return incomes.stream()
                .map(IncomeMapper::toIncomeEntryDTO) //
                .collect(Collectors.toList());
    }

    // Các phương thức createIncome, updateIncome, deleteIncome không thay đổi theo yêu cầu.
    // ... (giữ nguyên các phương thức này)
    /**
     * Phương thức MỚI: Tạo một khoản thu nhập mới.
     * Ví dụ: POST /api/income
     * @param incomeRequestDTO Dữ liệu yêu cầu để tạo thu nhập.
     * @return IncomeResponseDTO.IncomeEntryDTO của khoản thu nhập đã tạo.
     */
    @Override
    public IncomeResponseDTO.IncomeEntryDTO createIncome(IncomeRequestDTO incomeRequestDTO) {
        Income income = IncomeMapper.toIncome(incomeRequestDTO); //
        // Đặt ngày nhận là ngày hiện tại nếu không được cung cấp trong DTO
        if (income.getReceivedDate() == null) {
            income.setReceivedDate(LocalDate.now());
        }
        // Kiểm tra sự tồn tại của EventId
        try {
            eventService.getEventById(incomeRequestDTO.getEventId()); //
        } catch (Exception e) {
            throw new ResourceNotFoundException("Event not found with ID: " + incomeRequestDTO.getEventId());
        }
        Income savedIncome = incomeRepository.save(income); //
        return IncomeMapper.toIncomeEntryDTO(savedIncome); //
    }

    /**
     * Phương thức MỚI: Cập nhật một khoản thu nhập hiện có.
     * Ví dụ: PUT /api/income/123
     * @param incomeId ID của khoản thu nhập cần cập nhật.
     * @param incomeRequestDTO Dữ liệu yêu cầu để cập nhật thu nhập.
     * @return IncomeResponseDTO.IncomeEntryDTO của khoản thu nhập đã cập nhật.
     */
    @Override
    public IncomeResponseDTO.IncomeEntryDTO updateIncome(Integer incomeId, IncomeRequestDTO incomeRequestDTO) {
        Income existingIncome = incomeRepository.findById(incomeId) //
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with ID: " + incomeId));

        // Kiểm tra sự tồn tại của EventId nếu nó được cung cấp trong request DTO
        if (incomeRequestDTO.getEventId() != null && !incomeRequestDTO.getEventId().equals(existingIncome.getEventId())) {
            try {
                eventService.getEventById(incomeRequestDTO.getEventId()); //
            } catch (Exception e) {
                throw new ResourceNotFoundException("Event not found with ID: " + incomeRequestDTO.getEventId());
            }
            existingIncome.setEventId(incomeRequestDTO.getEventId());
        }

        // Cập nhật các trường có thể thay đổi từ DTO
        if (incomeRequestDTO.getAmount() != null) {
            existingIncome.setAmount(incomeRequestDTO.getAmount());
        }
        if (incomeRequestDTO.getTitle() != null) {
            existingIncome.setTitle(incomeRequestDTO.getTitle());
        }
        if (incomeRequestDTO.getDescription() != null) {
            existingIncome.setDescription(incomeRequestDTO.getDescription());
        }
        if (incomeRequestDTO.getSourceType() != null) {
            // Chuyển đổi String từ DTO thành SourceType enum
            existingIncome.setSourceType(Income.SourceType.valueOf(incomeRequestDTO.getSourceType()));
        }
        if (incomeRequestDTO.getSourceId() != null) {
            existingIncome.setSourceId(incomeRequestDTO.getSourceId());
        }
        if (incomeRequestDTO.getNotes() != null) {
            existingIncome.setNotes(incomeRequestDTO.getNotes());
        }

        Income updatedIncome = incomeRepository.save(existingIncome); //
        return IncomeMapper.toIncomeEntryDTO(updatedIncome); //
    }

    /**
     * Phương thức MỚI: Xóa một khoản thu nhập.
     * @param incomeId ID của khoản thu nhập cần xóa.
     */
}