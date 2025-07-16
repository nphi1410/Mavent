package com.mavent.dev.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.math.BigInteger;
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
    private BigInteger amount;
    private enum status{
        INTERESTED,NEGOTIATING,CONFIRMED,PAID,FULFILLED
    }
    private Date startDate;
    private Date endDate;
    private String notes;
    private String agreementDocumentUrl;
    private Integer mainContactAccountId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}
