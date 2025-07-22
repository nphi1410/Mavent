package com.mavent.dev.dto;

import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;
import com.mavent.dev.entity.MeetingAttendee;

import java.time.LocalDate;

public interface MeetingAttendeeDTO {
    Integer getmeetingId();
    Integer getAccountId();
    String getUsername();
    String getEmail();
    String getFullName();
    String getPhoneNumber();
    Account.Gender getGender();
    String getStudentId();
    LocalDate getDateOfBirth();
    MeetingAttendee.Status getAttendaceStatus();
}
