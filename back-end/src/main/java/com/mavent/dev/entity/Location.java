package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "locations")
@AllArgsConstructor
@NoArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer locationId;

    private String locationName;

    @Column(precision = 20, scale = 15)
    private BigDecimal latitude;

    @Column(precision = 20, scale = 15)
    private BigDecimal longitude;
}
