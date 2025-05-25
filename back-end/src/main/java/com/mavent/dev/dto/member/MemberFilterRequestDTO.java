package com.mavent.dev.dto.member;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for member search and filtering operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberFilterRequestDTO {

    @NotNull(message = "Event ID is required")
    private Integer eventId;
    
    @Size(max = 100, message = "Search term must not exceed 100 characters")
    private String searchTerm;
    
    @Pattern(regexp = "^(ADMIN|DEPARTMENT_MANAGER|MEMBER|PARTICIPANT|GUEST)$", 
             message = "Event role must be one of: ADMIN, DEPARTMENT_MANAGER, MEMBER, PARTICIPANT, GUEST")
    private String eventRole;
    
    private Integer departmentId;
    private Boolean isActive;
    
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;
    
    @Pattern(regexp = "^(USER|SUPER_ADMIN)$", message = "System role must be USER or SUPER_ADMIN")
    private String systemRole;
    
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Start date must be in format yyyy-MM-dd")
    private String startDate;
    
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "End date must be in format yyyy-MM-dd")
    private String endDate;
    
    @Min(value = 0, message = "Page number must be non-negative")
    private Integer page = 0;
    
    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size must not exceed 100")
    private Integer size = 10;
    
    @Pattern(regexp = "^(createdAt|fullName|eventRole|departmentName)$", 
             message = "Sort by must be one of: createdAt, fullName, eventRole, departmentName")
    private String sortBy = "createdAt";
    
    @Pattern(regexp = "^(asc|desc)$", message = "Sort direction must be 'asc' or 'desc'")
    private String sortDirection = "desc";
    
    // Manual Builder implementation
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private final MemberFilterRequestDTO dto = new MemberFilterRequestDTO();
        
        public Builder eventId(Integer eventId) {
            dto.eventId = eventId;
            return this;
        }
        
        public Builder searchTerm(String searchTerm) {
            dto.searchTerm = searchTerm;
            return this;
        }
        
        public Builder eventRole(String eventRole) {
            dto.eventRole = eventRole;
            return this;
        }
        
        public Builder departmentId(Integer departmentId) {
            dto.departmentId = departmentId;
            return this;
        }
        
        public Builder isActive(Boolean isActive) {
            dto.isActive = isActive;
            return this;
        }
        
        public Builder gender(String gender) {
            dto.gender = gender;
            return this;
        }
        
        public Builder systemRole(String systemRole) {
            dto.systemRole = systemRole;
            return this;
        }
        
        public Builder startDate(String startDate) {
            dto.startDate = startDate;
            return this;
        }
        
        public Builder endDate(String endDate) {
            dto.endDate = endDate;
            return this;
        }
        
        public Builder page(Integer page) {
            dto.page = page;
            return this;
        }
        
        public Builder size(Integer size) {
            dto.size = size;
            return this;
        }
        
        public Builder sortBy(String sortBy) {
            dto.sortBy = sortBy;
            return this;
        }
        
        public Builder sortDirection(String sortDirection) {
            dto.sortDirection = sortDirection;
            return this;
        }
        
        public MemberFilterRequestDTO build() {
            return dto;
        }
    }
}
