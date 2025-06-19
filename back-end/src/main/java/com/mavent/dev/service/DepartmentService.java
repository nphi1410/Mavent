package com.mavent.dev.service;

import com.mavent.dev.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<Department> getAllDepartmentsByEvent(Integer eventId);

    Department createDepartment(Department department);
}
