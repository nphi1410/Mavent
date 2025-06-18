package com.mavent.dev.service;

import com.mavent.dev.dto.department.DepartmentRequestDTO;
import com.mavent.dev.dto.department.DepartmentResponseDTO;
import com.mavent.dev.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponseDTO> getAllDepartmentsByEvent(Integer eventId);

    DepartmentResponseDTO createDepartment(DepartmentRequestDTO departmentRequestDTO);

    DepartmentResponseDTO updateDepartment(Integer departmentId, DepartmentRequestDTO departmentRequestDTO);

    void deleteDepartment(Integer departmentId);
}
