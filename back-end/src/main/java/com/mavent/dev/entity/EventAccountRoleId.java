package com.mavent.dev.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Represents the composite primary key for the EventAccountRole entity.
 * Consists of event_id and account_id.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventAccountRoleId implements Serializable {

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "account_id")
    private Integer accountId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EventAccountRoleId that = (EventAccountRoleId) o;

        if (!eventId.equals(that.eventId)) return false;
        return accountId.equals(that.accountId);
    }

    @Override
    public int hashCode() {
        int result = eventId.hashCode();
        result = 31 * result + accountId.hashCode();
        return result;
    }
}
