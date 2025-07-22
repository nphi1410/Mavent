package com.mavent.dev.dto.member;

import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.EventAccountRole;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface MemberDTO {
    Integer getAccountId();
    String getUsername();
    String getEmail();
    String getFullName();
    String getAvatarUrl();
    String getPhoneNumber();
    Account.Gender getGender();
    String getStudentId();
    LocalDate getDateOfBirth();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    Boolean getIsActive();
    EventAccountRole.EventRole getEventRole();
}

