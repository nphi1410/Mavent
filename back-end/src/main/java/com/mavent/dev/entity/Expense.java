package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer expenseId; // ĐÃ SỬA: Chuyển từ Long sang Integer

    @Column(name = "event_id")
    private Integer eventId; // Giữ nguyên Integer

    @Column(name = "budget_id")
    private Integer budgetId; // ĐÃ SỬA: Chuyển từ Long sang Integer (Giả định budget_id cũng dùng Integer)

    @Column(name = "category_id")
    private Integer categoryId; // Giữ nguyên Integer

    @Column(name = "department_id")
    private Integer departmentId; // Giữ nguyên Integer

    @Column(name = "amount", columnDefinition = "BIGINT")
    private BigInteger amount;

    @Column(name = "note",  columnDefinition = "TEXT")
    private String note;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "created_by_account_id")
    private Integer createdByAccountId; // ĐÃ SỬA: Chuyển từ Long sang Integer

    @Column(name = "approved_by_account_id")
    private Integer approvedByAccountId; // ĐÃ SỬA: Chuyển từ Long sang Integer

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum for Status
    public enum Status {
        PENDING,
        REJECTED,
        PAID,
        APPROVED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}