package com.mavent.dev.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Không cần import LocalDate nếu bạn không muốn nhận ngày từ request body
// import java.time.LocalDate;

@Data // Tự động tạo getters, setters, toString, equals, hashCode
@NoArgsConstructor // Tự động tạo constructor không đối số
@AllArgsConstructor // Tự động tạo constructor với tất cả các trường
public class IncomeRequestDTO {
    private Integer eventId;
    private Long amount; // Kiểu Long để khớp với BIGINT trong DB
    private String title;
    private String description;
    private String sourceType; // Nhận dưới dạng String, sẽ được chuyển đổi sang Enum ở backend
    private Integer sourceId;
    private String notes;
    // Nếu bạn muốn cho phép cập nhật receivedDate hoặc receivedByAccountId từ frontend,
    // hãy thêm chúng vào đây.
    // private LocalDate receivedDate;
    // private Integer receivedByAccountId;
}