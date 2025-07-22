package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "expenses")
public class Expenses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expense_id")
    private Integer expenseId;

    @Column(name = "event_id", nullable = false)
    private int eventId;

    @Column(name = "budget_id")
    private int budgetId;

    @Column(name = "category_id")
    private int categoryId;

    @Column(name = "department_id")
    private int departmentId;

    @Column(name = "amount", nullable = false, columnDefinition = "BIGINT")
    private Long amount;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.PENDING;

    @Column(name = "created_by_account_id")
    private int createdByAccountId;

    @Column(name = "approved_by_account_id")
    private Integer approvedByAccountId;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "response_content", columnDefinition = "TEXT")
    private String responseContent;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        PAID
    }
}
