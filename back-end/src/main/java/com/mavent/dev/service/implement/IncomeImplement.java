// src/main/java/com/mavent/dev/service/implement/IncomeImplement.java
package com.mavent.dev.service.implement;

import com.mavent.dev.dto.IncomeResponseDTO;
import com.mavent.dev.dto.IncomeRequestDTO; // Thêm import này
import com.mavent.dev.entity.Income;
import com.mavent.dev.repository.IncomeRepository;
import com.mavent.dev.service.EventService;
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
    private final EventService eventService;

    @Autowired
    public IncomeImplement(IncomeRepository incomeRepository, EventService eventService) {
        this.incomeRepository = incomeRepository;
        this.eventService = eventService;
    }

    @Override
    public IncomeResponseDTO getIncomeOverviewForEvent(Integer eventId, String dateRange) {
        // Kiểm tra xem eventId có tồn tại không
        String eventName = null;
        try {
            eventName = eventService.getEventById(eventId).getName();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }

        List<Income> incomes;
        LocalDate now = LocalDate.now();

        switch (dateRange.toLowerCase()) {
            case "30":
                incomes = incomeRepository.findByEventIdAndReceivedDateBetween(eventId, now.minusDays(30), now);
                break;
            case "7":
                incomes = incomeRepository.findByEventIdAndReceivedDateBetween(eventId, now.minusDays(7), now);
                break;
            case "today":
                incomes = incomeRepository.findByEventIdAndReceivedDate(eventId, now);
                break;
            case "all":
            default:
                incomes = incomeRepository.findByEventId(eventId);
                break;
        }

        // Nếu không có dữ liệu thu nhập, trả về DTO với các giá trị tổng bằng 0
        // và tên sự kiện đã lấy được.
        return IncomeMapper.toIncomeResponseDTO(eventId, eventName, dateRange, List.of());
    }

    @Override
    public List<IncomeResponseDTO.IncomeEntryDTO> getIncomesListByEventId(Integer eventId) {
        // Đảm bảo sự kiện tồn tại trước khi lấy danh sách thu nhập
        try {
            eventService.getEventById(eventId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }

        List<Income> incomes = incomeRepository.findByEventId(eventId);

        return incomes.stream()
                .map(IncomeMapper::toIncomeEntryDTO)
                .collect(Collectors.toList());
    }

    @Override
    public IncomeResponseDTO.IncomeEntryDTO createIncome(IncomeRequestDTO incomeRequestDTO) {
        // Kiểm tra xem eventId có tồn tại không trước khi tạo thu nhập
        try {
            eventService.getEventById(incomeRequestDTO.getEventId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Event not found with ID: " + incomeRequestDTO.getEventId());
        }

        Income income = IncomeMapper.toIncome(incomeRequestDTO);
        income.setReceivedDate(LocalDate.now()); // Đặt ngày nhận là ngày hiện tại
        // Bạn có thể đặt receivedByAccountId ở đây nếu có thông tin người dùng đang đăng nhập
        // income.setReceivedByAccountId(...);
        Income savedIncome = incomeRepository.save(income);
        return IncomeMapper.toIncomeEntryDTO(savedIncome);
    }

    @Override
    public IncomeResponseDTO.IncomeEntryDTO updateIncome(Integer incomeId, IncomeRequestDTO incomeRequestDTO) {
        Income existingIncome = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with ID: " + incomeId));

        // Kiểm tra xem eventId trong DTO có tồn tại không nếu nó khác với eventId hiện tại
        if (incomeRequestDTO.getEventId() != null && !existingIncome.getEventId().equals(incomeRequestDTO.getEventId())) {
            try {
                eventService.getEventById(incomeRequestDTO.getEventId());
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
        // receivedDate và receivedByAccountId thường không được cập nhật qua API này,
        // nhưng nếu cần, bạn có thể thêm logic ở đây.

        Income updatedIncome = incomeRepository.save(existingIncome);
        return IncomeMapper.toIncomeEntryDTO(updatedIncome);
    }
}