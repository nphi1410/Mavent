package com.mavent.dev.service.implement;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Request;
import com.mavent.dev.mapper.RequestMapper;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.repository.RequestRepository;
import com.mavent.dev.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestImplement implements RequestService {
    @Autowired
    RequestRepository requestRepository;
    @Autowired
    AccountRepository accountRepository;

    @Override
    public List<Request> getRequestByAccountAndEventId(Integer accountId, Integer eventId) {
        return requestRepository.findByRequestByAccountIdAndEventId(accountId, eventId);
    }

    @Override
    public List<Request> getRequestsByEventId(Integer eventId) {
        return requestRepository.findByEventId(eventId);
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
    public boolean updateRequest(UpdateRequestDTO requestDTO) {
        try {
            Request request = requestRepository.findByRequestId(requestDTO.getRequestId());
            if (request == null) {
                return false;
            }
            request.setStatus(Request.Status.valueOf(requestDTO.getStatus()));
            request.setResponseByAccountId(requestDTO.getResponseByAccountId());
            request.setResponseContent(requestDTO.getResponseContent());
            request.setUpdatedAt(LocalDateTime.now());
            System.out.println("Updating request: " + requestDTO.getRequestId());
//            return requestRepository.updateRequestByRequestId(
//                    request.getRequestId(),
//                    requestDTO.getStatus(),
//                    requestDTO.getResponseContent(),
//                    requestDTO.getResponseByAccountId()
//            );
            requestRepository.save(request);
            System.out.println("Request updated successfully: " + requestDTO.getRequestId());
            Request newRequest = requestRepository.findByRequestId(requestDTO.getRequestId());
            System.out.println("New Request Details: " + newRequest.getStatus());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
