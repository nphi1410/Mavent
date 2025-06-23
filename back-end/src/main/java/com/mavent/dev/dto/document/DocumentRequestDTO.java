package com.mavent.dev.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequestDTO {
    @NotNull(message = "Event ID is required")
    private Integer eventId;

    private Integer departmentId;

    // Made optional for authenticated requests where the ID comes from the authenticated user
    private Integer uploaderAccountId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    // File is handled separately in the controller
}
