package com.mavent.dev.mapper;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.RequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.*;
import com.mavent.dev.service.AccountService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RequestMapper {

    public static Request toEntity(CreateRequestDTO requestDTO) {
        new Request();
        return Request.builder()
                .requestByAccountId(requestDTO.getAccountId())
                .eventId(requestDTO.getEventId())
                .taskId(requestDTO.getTaskId())
                .departmentId(requestDTO.getDepartmentId())
                .requestTypeId(requestDTO.getRequestTypeId())
                .content(requestDTO.getContent())
                .title(requestDTO.getTitle())
                .build();
    }

    public static Request toEntity(UpdateRequestDTO requestDTO) {
        new Request();
        return Request.builder()
                .requestId(requestDTO.getRequestId())
                .responseByAccountId(requestDTO.getResponseByAccountId())
                .status(Request.Status.valueOf(requestDTO.getStatus()))
                .responseContent(requestDTO.getResponseContent())
                .build();
    }

    public static RequestDTO fromRequestToRequestDTO(Request request, AccountService accountService) {
        if (request == null) {
            return null;
        }
        Account requestByAccount = accountService.getAccountById(request.getRequestByAccountId());
        Account responseByAccount = null;
        String responseByAccountUsername = null;
        if (request.getResponseByAccountId() != null) {
            responseByAccount = accountService.getAccountById(request.getResponseByAccountId());
            responseByAccountUsername = responseByAccount.getUsername();
        }
        new RequestDTO();
        return RequestDTO.builder()
                .responseByAccountId(request.getResponseByAccountId())
                .requestTypeId(request.getRequestTypeId())
                .taskId(request.getTaskId())
                .requestId(request.getRequestId())
                .eventId(request.getEventId())
                .departmentId(request.getDepartmentId())
                .requestByAccountId(request.getRequestByAccountId())
                .requestByUsername(requestByAccount.getUsername())
                .title(request.getTitle())
                .requestContent(request.getContent())
                .status(request.getStatus().name())
                .responseContent(request.getResponseContent())
                .responseByUsername(responseByAccountUsername)
                .createdAt(request.getCreatedAt() != null ? request.getCreatedAt().toString() : null)
                .updatedAt(request.getUpdatedAt() != null ? request.getUpdatedAt().toString() : null)
                .build();
    }

    public static List<RequestDTO> toDTOList(List<Request> requests, AccountService accountService) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }
        return requests.stream()
                .map((Request request) -> fromRequestToRequestDTO(request, accountService))
                .toList();
    }
}

