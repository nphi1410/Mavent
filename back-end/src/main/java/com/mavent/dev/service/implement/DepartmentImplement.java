package com.mavent.dev.service.implement;

import com.mavent.dev.dto.department.DepartmentRequestDTO;
import com.mavent.dev.dto.department.DepartmentResponseDTO;
import com.mavent.dev.entity.Department;
import com.mavent.dev.mapper.DepartmentMapper;
import com.mavent.dev.repository.DepartmentRepository;
import com.mavent.dev.service.DepartmentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepartmentImplement implements DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public List<DepartmentResponseDTO> getAllDepartmentsByEvent(Integer eventId) {
        return departmentRepository.findByEventId(eventId).stream().map(DepartmentMapper::toDTO).toList();
    }

    @Override
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO departmentRequestDTO) {
        //Convert DTO to entity
        Department department = DepartmentMapper.toEntity(departmentRequestDTO);
        //Get current time
        LocalDateTime now = LocalDateTime.now();

        department.setCreatedAt(now);
        department.setUpdatedAt(now);

       Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.toDTO(savedDepartment);
    }

    @Override
    public DepartmentResponseDTO updateDepartment(Integer departmentId, DepartmentRequestDTO departmentRequestDTO) {

        // Convert DTO to entity
        Department existingDepartment = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));

        existingDepartment.setName(departmentRequestDTO.getName());
        existingDepartment.setDescription(departmentRequestDTO.getDescription());

        // Update timestamps
        Department updatedDepartment = departmentRepository.save(existingDepartment);

        return DepartmentMapper.toDTO(updatedDepartment);
    }
    @Override
    public void deleteDepartment(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));
        departmentRepository.delete(department);
    }
}
