package com.mavent.dev.DTO;

import com.mavent.dev.entity.Account;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Nullable
public class AccountDTO {

    // DTO for login request
    private String email;
    private String username;
    private String password;
    private String newPassword;
}