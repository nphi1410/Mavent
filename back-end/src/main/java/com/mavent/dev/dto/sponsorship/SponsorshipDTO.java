package com.mavent.dev.dto.sponsorship;

import java.sql.Date;
import java.sql.Timestamp;

public interface SponsorshipDTO {

    Integer getEventSponsorshipId();

    Integer getEventId();

    String getEventName();

    Integer getSponsorId();

    String getSponsorName();

    String getSponsorLogoUrl();

    Integer getPackageId();

    String getPackageName();

    Long getSinglePackAmount();

    Long getAmount();

    Status getStatus(); // Enum below

    Date getStartDate();

    Date getEndDate();

    String getNotes();

    String getAgreementDocumentUrl();

    Integer getMainContactAccountId();

    String getAccountName();

    Timestamp getCreatedAt();

    Timestamp getUpdatedAt();

    enum Status {
        INTERESTED,
        NEGOTIATING,
        CONFIRMED,
        PAID,
        FULFILLED
    }
}

