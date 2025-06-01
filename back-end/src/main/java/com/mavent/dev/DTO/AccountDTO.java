package com.mavent.dev.DTO;

import jakarta.annotation.Nullable;
import lombok.Getter;

@Getter
public class AccountDTO {
    // DTO for login request
    private String email;
    private String username;
    private String password;
}