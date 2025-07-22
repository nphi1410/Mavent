package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Data
@Table(name = "event_sponsorships")
public class EventSponsorship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer eventSponsorshipId;
    private Integer eventId;
    private Integer sponsorId;
    private Integer packageId;
    private Long amount;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "enum('INTERESTED','NEGOTIATING','CONFIRMED','PAID','FULFILLED') default 'INTERESTED'")
    private Status status;
    private Date startDate;
    private Date endDate;
    private String notes;
    private String agreementDocumentUrl;
    private Integer mainContactAccountId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public enum Status {
        INTERESTED, NEGOTIATING, CONFIRMED, PAID, FULFILLED
    }

}
