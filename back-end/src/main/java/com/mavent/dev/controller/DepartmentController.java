package com.mavent.dev.controller;

import com.mavent.dev.entity.Department;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.dto.common.ApiResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponseDTO<List<Department>>> getDepartmentsByEvent(
            @RequestParam Integer eventId) {
        try {
            List<Department> departments = departmentRepository.findByEventId(eventId);

            ApiResponseDTO<List<Department>> response = ApiResponseDTO.<List<Department>>builder()
                    .success(true)
                    .message("Departments retrieved successfully")
                    .data(departments)
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDTO<List<Department>> response = ApiResponseDTO.<List<Department>>builder()
                    .success(false)
                    .message("Error retrieving departments: " + e.getMessage())
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }
}
