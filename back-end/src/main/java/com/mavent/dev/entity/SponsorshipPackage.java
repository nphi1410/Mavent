package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "sponsorship_packages")
public class SponsorshipPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer packageId;
    private Integer eventId;
    private String name;
    private Double amount;
    private String description;
    private String benefits;
    private Integer maxSponsors;
    private Boolean isActive;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
