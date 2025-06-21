package com.mavent.dev.dto.account;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Base dto for Account operations.
 * Used for account profile management and basic information display.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDTO {

    private Integer accountId;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username can only contain letters, numbers, dots, underscores, and hyphens")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Size(max = 20, message = "Student ID must not exceed 20 characters")
    private String studentId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    @Pattern(regexp = "^[+]?[0-9\\s-()]*$", message = "Phone number format is invalid")
    private String phoneNumber;

    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    private String avatarUrl;

    @NotNull(message = "System role is required")
    @Pattern(regexp = "^(USER|SUPER_ADMIN)$", message = "System role must be USER or SUPER_ADMIN")
    private String systemRole;

    private Boolean isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    /**
     * Constructor used by AccountMapper
     */
    public AccountDTO(Integer accountId, String username, String email, String fullName,
                      String phoneNumber, String systemRole, String avatarUrl, Boolean isDeleted) {
        this.accountId = accountId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.systemRole = systemRole;
        this.avatarUrl = avatarUrl;
        this.isDeleted = isDeleted;
    }
}
