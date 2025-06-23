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
@RequestMapping("/api/events/{eventId}/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponseDTO>> getByEvent(
            @PathVariable Integer eventId) {
        List<DepartmentResponseDTO> departments =
                departmentService.getAllDepartmentsByEvent(eventId);
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponseDTO> getDepartmentById(
            @PathVariable Integer eventId,
            @PathVariable Integer departmentId) {
        // Validate department belongs to event
        DepartmentResponseDTO department =
                departmentService.getDepartmentById(departmentId);
        return ResponseEntity.ok(department);
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> create(
            @PathVariable Integer eventId,
            @RequestBody @Valid DepartmentRequestDTO dto,
            UriComponentsBuilder uriBuilder) {

        // Create department for specific event
        DepartmentResponseDTO created =
                departmentService.createDepartment(dto);

        // Build correct URI with both eventId and departmentId
        URI location = uriBuilder
                .path("/api/events/{eventId}/departments/{departmentId}")
                .buildAndExpand(eventId, created.getDepartmentId())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(created);
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponseDTO> update(
            @PathVariable Integer eventId,
            @PathVariable Integer departmentId,
            @RequestBody @Valid DepartmentRequestDTO dto) {

        // Update department belonging to specific event
        DepartmentResponseDTO updated =
                departmentService.updateDepartment(departmentId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Integer eventId,
            @PathVariable Integer departmentId) {

        // Delete department belonging to specific event
        departmentService.deleteDepartment(departmentId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Department deleted successfully");
        response.put("eventId", String.valueOf(eventId));
        response.put("departmentId", String.valueOf(departmentId));

        return ResponseEntity.ok(response);
    }

    /**
     * Get the number of members in a department
     * @param eventId The event ID
     * @param departmentId The department ID
     * @return Response containing the member count
     */
    @GetMapping("/{departmentId}/member-count")
    public ResponseEntity<Map<String, Object>> getMemberCount(
            @PathVariable Integer eventId,
            @PathVariable Integer departmentId) {

        // Get the count of members in the department
        long memberCount = departmentService.countMembersByDepartmentId(departmentId);

        Map<String, Object> response = new HashMap<>();
        response.put("departmentId", departmentId);
        response.put("eventId", eventId);
        response.put("memberCount", memberCount);

        return ResponseEntity.ok(response);
    }
}

