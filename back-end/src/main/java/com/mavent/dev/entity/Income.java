package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigInteger;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Data
@Table(name = "income")
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer incomeId;
    private Integer eventId;
    private BigInteger amount;
    private String title;
    private String description;
    private enum sourceType{
        SPONSOR,TICKET_SALES,MERCHANDISE,DONATION,OTHER
    }
    private Integer sourceId;
    private Date receivedDate;
    private Integer receivedByAccountId;
    private String notes;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}
