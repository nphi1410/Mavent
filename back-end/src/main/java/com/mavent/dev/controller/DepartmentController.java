package com.mavent.dev.controller;


import com.mavent.dev.dto.department.DepartmentRequestDTO;
import com.mavent.dev.dto.department.DepartmentResponseDTO;

import com.mavent.dev.service.DepartmentService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponseDTO>> getByEvent(
            @RequestParam Integer eventId) {
        List<DepartmentResponseDTO> departments =
                departmentService.getAllDepartmentsByEvent(eventId);
        return ResponseEntity.ok(departments);
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> create(
            @RequestBody @Valid DepartmentRequestDTO dto,
            UriComponentsBuilder uriBuilder) {
        DepartmentResponseDTO created = departmentService.createDepartment(dto);
        URI location = uriBuilder
                .path("/api/departments/{id}")
                .buildAndExpand(created.getDepartmentId())
                .toUri();
        return ResponseEntity
                .created(location)
                .body(created);
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponseDTO> update(
            @PathVariable Integer departmentId,
            @RequestBody @Valid DepartmentRequestDTO dto
    ){
        DepartmentResponseDTO updated = departmentService.updateDepartment(departmentId,dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<Map<String,String>> delete(@PathVariable Integer departmentId) {
        departmentService.deleteDepartment(departmentId);
        Map<String,String> response = new HashMap<>();
        response.put("message", "Department deleted successfully");
        response.put("departmentId", String.valueOf(departmentId));

        return ResponseEntity.ok(response);
    }


}
