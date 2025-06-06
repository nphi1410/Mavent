package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    @Column(name = "location")
    private String location;
    
    @Column(name = "location_id")
    private Integer locationId;

    @Column(name = "dday_info", columnDefinition = "TEXT")
    private String ddayInfo;

    @Column(name = "max_member_number")
    private Integer maxMemberNumber = 0;

    @Column(name = "max_participant_number")
    private Integer maxParticipantNumber = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EventStatus status = EventStatus.PENDING;

    @Column(name = "created_by_account_id")
    private Integer createdBy;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Column(name = "poster_url")
    private String posterUrl;

    public enum EventStatus {
        RECRUITING, UPCOMING, ONGOING, ENDED, CANCELLED, PENDING, REVIEWING
    }
}