package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "sponsors")
public class Sponsor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sponsorId;
    private String name;
    private String logoUrl;
    private String website;
    private String industry;
    private String address;
    private String contactPersonName;
    private String contactEmail;
    private String contactPhone;
    private String notes;
    private Integer createdByAccountId;
    private Boolean isDeleted;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}

