package com.mavent.dev.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@Entity
@Table(name = "google_calendar_events")
public class GoogleCalendarEvent {

    @EmbeddedId
    private GoogleCalendarEventId id;

    @Column(name = "google_event_id")
    private String googleEventId;

    public GoogleCalendarEvent(Integer meetingId, Integer accountId, String googleEventId) {
        this.id = new GoogleCalendarEventId(meetingId, accountId);
        this.googleEventId = googleEventId;
    }

    public Integer getMeetingId() {
        return id.getMeetingId();
    }

    public Integer getAccountId() {
        return id.getAccountId();
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoogleCalendarEventId implements Serializable {
        private Integer meetingId;
        private Integer accountId;
    }
}

