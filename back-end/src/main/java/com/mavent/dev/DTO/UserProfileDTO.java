package com.mavent.dev.DTO;

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
}

