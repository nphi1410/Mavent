// src/main/java/com/mavent/dev/repository/IncomeRepository.java
package com.mavent.dev.repository;

import com.mavent.dev.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> { // Đổi từ Long sang Integer

    /**
     * Tìm tất cả các khoản thu nhập cho một sự kiện cụ thể.
     * @param eventId ID của sự kiện
     * @return Danh sách các khoản thu nhập
     */
    List<Income> findByEventId(Integer eventId); // Đổi từ Long sang Integer

    /**
     * Tìm tất cả các khoản thu nhập cho một sự kiện cụ thể trong một phạm vi ngày nhất định.
     * @param eventId ID của sự kiện
     * @param startDate Ngày bắt đầu của phạm vi
     * @param endDate Ngày kết thúc của phạm vi
     * @return Danh sách các khoản thu nhập trong phạm vi ngày
     */
    List<Income> findByEventIdAndReceivedDateBetween(Integer eventId, LocalDate startDate, LocalDate endDate); // Đổi từ Long sang Integer

    /**
     * Tìm tất cả các khoản thu nhập cho một sự kiện cụ thể và loại nguồn.
     * @param eventId ID của sự kiện
     * @param sourceType Loại nguồn thu (e.g., "SPONSOR", "TICKET_SALES")
     * @return Danh sách các khoản thu nhập theo loại nguồn
     */
    List<Income> findByEventIdAndSourceType(Integer eventId, String sourceType); // Đổi từ Long sang Integer
}