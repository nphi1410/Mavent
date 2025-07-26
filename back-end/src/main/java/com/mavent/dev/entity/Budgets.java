package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "budgets")
public class Budgets {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int budgetId;
    private int eventId;
    @Column(name = "total_amount", columnDefinition = "BIGINT")
    private BigInteger totalAmount;
    @Column(name = "spent_amount", columnDefinition = "BIGINT")
    private BigInteger spentAmount;
    private String notes;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
