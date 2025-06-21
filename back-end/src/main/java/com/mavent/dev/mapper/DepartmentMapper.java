package com.mavent.dev.mapper;

import com.mavent.dev.dto.department.DepartmentRequestDTO;
import com.mavent.dev.dto.department.DepartmentResponseDTO;
import com.mavent.dev.entity.Department;

public class DepartmentMapper {

    public static Department toEntity(DepartmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Department department = new Department();

        if (dto.getDepartmentId() != null){
            department.setDepartmentId(dto.getDepartmentId());
        }
        department.setEventId(dto.getEventId());
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());

        return department;
    }


    public static DepartmentResponseDTO toDTO(Department department) {
        if (department == null) {
            return null;
        }

        return DepartmentResponseDTO.builder()
        .departmentId(department.getDepartmentId())
        .eventId(department.getEventId())
        .name(department.getName())
        .description(department.getDescription())
        .createdAt(department.getCreatedAt())
        .updatedAt(department.getUpdatedAt())
        .build();
    }
}
