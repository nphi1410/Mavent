package com.mavent.dev.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    private int accountId;
    private String username;
    private String passwordHash;
    private String email;
    private String fullName;
    private String systemRole;
    private Boolean isDeleted;
    private String avatarImg;
    private String phone;
    private String gender;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}
