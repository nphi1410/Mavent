package com.mavent.dev.DTO;

import com.mavent.dev.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserProfileDTO {
    private Integer id;
    private String username;
    private String email;
    private String fullName;
    private String avatarImg;
    private String phoneNumber;
    private String gender;
    private LocalDate dateOfBirth;
    private String studentId;
    private Account.SystemRole systemRole;
    public Account.SystemRole getSystemRole() {
        return systemRole;
    }
}
