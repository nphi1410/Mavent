package com.mavent.dev.controller;

import com.mavent.dev.entity.RequestType;
import com.mavent.dev.repository.RequestTypeRepository;
import com.mavent.dev.service.RequestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<RequestType> createRequestType(@RequestBody RequestType requestType) {
        return ResponseEntity.ok(requestTypeService.addRequestType(requestType));
    }

    @DeleteMapping("{requestTypeId}")
    public ResponseEntity<String> deleteRequestType(
            @PathVariable int requestTypeId
    ) {
        try {
            requestTypeService.deleteRequestType(requestTypeId);
            return ResponseEntity.ok("Request type deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Request type not found");
        }
    }

    @PutMapping("{requestTypeId}")
    public ResponseEntity<RequestType> updateRequestType(
            @PathVariable int requestTypeId,
            @RequestBody RequestType requestType
    ){
      return ResponseEntity.ok(requestTypeService.updateRequestType(requestTypeId, requestType));
    }
}
