package com.mavent.dev.service.implement;

import com.mavent.dev.entity.RequestType;
import com.mavent.dev.repository.RequestTypeRepository;
import com.mavent.dev.service.RequestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestTypeImplement implements RequestTypeService {
    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Override
    public List<RequestType> getRequestTypes() {
        return requestTypeRepository.findAllBy();
    }
}
