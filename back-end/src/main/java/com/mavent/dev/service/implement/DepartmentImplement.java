package com.mavent.dev.service.implement;

import com.mavent.dev.entity.Department;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentImplement implements DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public List<Department> getAllDepartmentsByEvent(Integer eventId) {
        return departmentRepository.findByEventId(eventId);
    }

    @Override
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }
}
