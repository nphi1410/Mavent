// src/main/java/com/mavent/dev/entity/Income.java
package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "income")
@Data // Tự động tạo getters, setters, toString, equals, hashCode
@NoArgsConstructor // Tự động tạo constructor không đối số
@AllArgsConstructor // Tự động tạo constructor với tất cả các trường
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "income_id")
    private Integer incomeId;

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING) // Quan trọng: Chỉ định cách lưu Enum vào DB (lưu tên String)
    @Column(name = "source_type", length = 50, nullable = false)
    private SourceType sourceType; // Sử dụng enum lồng nhau

    @Column(name = "source_id")
    private Integer sourceId;

    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;

    @Column(name = "received_by_account_id")
    private Integer receivedByAccountId;

    @Column(name = "notes", length = 1000)
    private String notes;

    /**
     * Enum đại diện cho các loại nguồn thu nhập của sự kiện.
     * Các giá trị này phải khớp với các giá trị được định nghĩa trong cột ENUM 'source_type' trong cơ sở dữ liệu.
     * Được định nghĩa là static nested enum để giữ code gần với Income entity.
     */
    public enum SourceType {
        SPONSOR,
        TICKET_SALES,
        DONATION,
        MERCHANDISE,
        OTHER
    }
}