// src/main/java/com/mavent/dev/repository/IncomeRepository.java
package com.mavent.dev.repository;

import com.mavent.dev.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {

    // Phương thức đã có
    List<Income> findByEventId(Integer eventId);

    // Phương thức đã có
    List<Income> findByEventIdAndReceivedDateBetween(Integer eventId, LocalDate startDate, LocalDate endDate);

    // Phương thức đã có
    List<Income> findByEventIdAndReceivedDate(Integer eventId, LocalDate receivedDate);

    // Phương thức MỚI: Lấy tất cả thu nhập theo EventId
    List<Income> findAllByEventId(Integer eventId); // Đổi tên rõ ràng hơn nếu cần, nhưng findByEventId đã có chức năng này
    // Sử dụng findByEventId để tránh trùng lặp

    Income findBySourceId(Integer sourceId);
}