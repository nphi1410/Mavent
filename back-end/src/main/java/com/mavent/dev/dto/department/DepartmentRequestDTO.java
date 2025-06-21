package com.mavent.dev.dto.department;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentRequestDTO {
    private Integer eventId;
    private Integer departmentId;
    private String name;
    private String description;
}
