package com.mavent.dev.entity;

import java.io.Serializable;
import java.util.Objects;

public class EventFeedbackId implements Serializable {
    private Long eventId;
    private Long accountId;

    public EventFeedbackId() {
    }

    public EventFeedbackId(Long eventId, Long accountId) {
        this.eventId = eventId;
        this.accountId = accountId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EventFeedbackId)) return false;
        EventFeedbackId that = (EventFeedbackId) o;
        return Objects.equals(eventId, that.eventId) && Objects.equals(accountId, that.accountId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, accountId);
    }
}