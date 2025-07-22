package com.mavent.dev.service.implement;

import com.mavent.dev.entity.RequestType;
import com.mavent.dev.repository.RequestTypeRepository;
import com.mavent.dev.service.RequestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestTypeImplement implements RequestTypeService {
    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Override
    public RequestType getRequestTypeById(int requestTypeId) {
        return requestTypeRepository.findById(requestTypeId)
                .orElseThrow(() -> new IllegalArgumentException("Request type not found with id: " + requestTypeId));
    }

    @Override
    public List<RequestType> getRequestTypes() {
        return requestTypeRepository.findAllBy();
    }

    @Override
    public RequestType addRequestType(RequestType requestType) {
        return requestTypeRepository.save(requestType);
    }

    @Override
        public RequestType updateRequestType(int requestTypeId, RequestType requestType) {
            RequestType existing = getRequestTypeById(requestTypeId);
            existing.setName(requestType.getName());
            existing.setDescription(requestType.getDescription());
            existing.setIsActive(requestType.getIsActive());
            existing.setUpdatedAt(LocalDateTime.now());
            return requestTypeRepository.save(existing);
        }

    @Override
    public void deleteRequestType(int requestTypeId) {
        requestTypeRepository.deleteById(requestTypeId);
    }


}
