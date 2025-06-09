package com.mavent.dev.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(EventTag.PK.class)

public class EventTag {

    @Id
    private Integer eventId;
    @Id
    private Integer tagId;

    @Data
    public static class PK implements Serializable {
        private Integer eventId;
        private Integer tagId;
    }
}
