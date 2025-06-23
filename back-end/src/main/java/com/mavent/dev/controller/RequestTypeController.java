package com.mavent.dev.controller;

import com.mavent.dev.entity.RequestType;
import com.mavent.dev.repository.RequestTypeRepository;
import com.mavent.dev.service.RequestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/request-type")
public class RequestTypeController {
    @Autowired
    private RequestTypeService requestTypeService;

    @GetMapping()
    public ResponseEntity<List<RequestType>> getAllRequestTypes() {
        return ResponseEntity.ok(requestTypeService.getRequestTypes());
    }
}
