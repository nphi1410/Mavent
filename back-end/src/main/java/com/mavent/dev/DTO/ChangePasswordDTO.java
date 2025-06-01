package com.mavent.dev.DTO;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ChangePasswordDTO {
    private String oldPassword;
    private String newPassword;
}
