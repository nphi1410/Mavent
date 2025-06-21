package com.mavent.dev.dto.superadmin;

import com.mavent.dev.entity.Account.Gender;
import com.mavent.dev.entity.Account.SystemRole;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private Integer accountId;
    private String username;
    private String email;
    private String fullName;
    private SystemRole systemRole;
    private String avatarUrl;
    private String phoneNumber;
    private Gender gender;
    private String studentId;
    private LocalDate dateOfBirth;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted;

}
