package com.mavent.dev.controller;

import com.mavent.dev.dto.common.ApiResponseDTO;
import com.mavent.dev.entity.Department;
import com.mavent.dev.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DepartmentController {

   @Autowired
   private DepartmentService departmentService;

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartmentsByEvent(
            @RequestParam Integer eventId) {
        return ResponseEntity.ok(departmentService.getAllDepartmentsByEvent(eventId));
    }

    @PostMapping("department/create")
    public ResponseEntity<ApiResponseDTO<Department>> createDepartment(@RequestBody Department department) {
        try {
            Department createdDepartment = departmentService.createDepartment(department);
            ApiResponseDTO<Department> response = ApiResponseDTO.<Department>builder()
                    .success(true)
                    .message("Department created successfully")
                    .data(createdDepartment)
                    .timestamp(LocalDateTime.now().toString())
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDTO<Department> response = ApiResponseDTO.<Department>builder()
                    .success(false)
                    .message("Error creating department: " + e.getMessage())
                    .timestamp(LocalDateTime.now().toString())
                    .build();
            return ResponseEntity.status(500).body(response);
        }
    }

}
