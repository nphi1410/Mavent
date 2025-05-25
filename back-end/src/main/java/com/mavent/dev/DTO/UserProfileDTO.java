package com.mavent.dev.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserProfileDTO {
    private Integer id;
    private String username;
    private String email;
    private String fullName;
    private String avatarImg;
    private String phone;
    private String gender;

}

