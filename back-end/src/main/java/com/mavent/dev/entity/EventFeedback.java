package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(EventFeedback.PK.class)
public class EventFeedback {

    @Id
    private Integer eventId;
    @Id
    private Integer accountId;
    private Integer rating;
    private String comment;
    private LocalDateTime submitted_at;

    @Data
    public static class PK implements Serializable {
        private Integer eventId;
        private Integer accountId;
    }
}
