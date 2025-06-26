package com.mavent.dev.service.implement;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.RequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Request;
import com.mavent.dev.mapper.RequestMapper;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.RequestRepository;
import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestImplement implements RequestService {
    @Autowired
    RequestRepository requestRepository;
    @Autowired
    private AccountService accountService;

    @Override
    public List<RequestDTO> getRequestByAccountAndEventId(Integer accountId, Integer eventId) {
        return RequestMapper.toDTOList(requestRepository.findByRequestByAccountIdAndEventId(accountId, eventId, Sort.by(Sort.Direction.DESC, "createdAt").descending()), accountService);
    }

    @Override
    public List<RequestDTO> getRequestsByEventId(Integer eventId) {
        System.out.println("Fetching requests for event ID: " + eventId);
        return RequestMapper.toDTOList(requestRepository.findByEventId(eventId, Sort.by(Sort.Direction.DESC, "createdAt")), accountService);
    }

    @Override
    public List<RequestDTO> getRequestByEventIdAndDepartmentId(Integer eventId, Integer departmentId) {
        return RequestMapper.toDTOList(requestRepository.findByEventIdAndDepartmentId(eventId, departmentId, Sort.by(Sort.Direction.DESC, "createdAt")) , accountService);
    }

    @Override
    public Request getRequestByRequestId(Integer requestId) {
        return requestRepository.findByRequestId(requestId);
    }

    @Override
    public boolean addRequest(CreateRequestDTO requestDTO) {
        try {
            Request request = RequestMapper.toEntity(requestDTO);
            request.setCreatedAt(LocalDateTime.now());
            requestRepository.save(request);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateRequest(UpdateRequestDTO requestDTO, Integer requestId) {
        try {
            Request request = requestRepository.findByRequestId(requestId);
            if (request == null) {
                return false;
            }
            request.setStatus(Request.Status.valueOf(requestDTO.getStatus()));
            request.setResponseByAccountId(requestDTO.getResponseByAccountId());
            request.setResponseContent(requestDTO.getResponseContent());
            request.setUpdatedAt(LocalDateTime.now());
//            System.out.println("Updating request: " + requestDTO.getRequestId());
            requestRepository.save(request);
//            System.out.println("Request updated successfully: " + requestDTO.getRequestId());
//            Request newRequest = requestRepository.findByRequestId(requestId);
//            System.out.println("New Request Details: " + newRequest.getStatus());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
