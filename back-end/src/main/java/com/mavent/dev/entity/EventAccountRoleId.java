package com.mavent.dev.entity;

import java.io.Serializable;
import java.util.Objects;

public class EventAccountRoleId implements Serializable {
    private Long eventId;
    private Long accountId;

    public EventAccountRoleId() {
    }

    public EventAccountRoleId(Long eventId, Long accountId) {
        this.eventId = eventId;
        this.accountId = accountId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EventAccountRoleId)) return false;
        EventAccountRoleId that = (EventAccountRoleId) o;
        return Objects.equals(eventId, that.eventId) && Objects.equals(accountId, that.accountId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, accountId);
    }
}