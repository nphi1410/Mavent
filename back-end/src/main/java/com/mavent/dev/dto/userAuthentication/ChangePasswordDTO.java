package com.mavent.dev.dto.userAuthentication;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDTO {
    private String oldPassword;
    private String newPassword;
}
