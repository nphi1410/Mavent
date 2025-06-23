package com.mavent.dev.mapper;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.RequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.*;
import com.mavent.dev.service.AccountService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RequestMapper {

    public static Request toEntity(CreateRequestDTO requestDTO) {
        Request request = new Request();
        request.setRequestByAccountId(requestDTO.getAccountId());
        request.setEventId(requestDTO.getEventId());
        request.setTaskId(requestDTO.getTaskId());
        request.setDepartmentId(requestDTO.getDepartmentId());
        request.setRequestTypeId(requestDTO.getRequestTypeId());
        request.setContent(requestDTO.getContent());
        return request;
    }

    public static Request toEntity(UpdateRequestDTO requestDTO) {
        Request request = new Request();
        request.setRequestId(requestDTO.getRequestId());
        request.setResponseByAccountId(requestDTO.getResponseByAccountId());
        request.setStatus(Request.Status.valueOf(requestDTO.getStatus()));
        request.setResponseContent(requestDTO.getResponseContent());
        return request;
    }

    public static CreateRequestDTO fromEntity(Request request) {
        if (request == null) {
            return null;
        }
        CreateRequestDTO requestDTO = new CreateRequestDTO();
        requestDTO.setAccountId(request.getRequestByAccountId());
        requestDTO.setEventId(request.getEventId());
        requestDTO.setTaskId(request.getTaskId());
        requestDTO.setDepartmentId(request.getDepartmentId());
        requestDTO.setRequestTypeId(request.getRequestTypeId());
        requestDTO.setContent(request.getContent());
        return requestDTO;
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
        return new RequestDTO().builder()
                .responseByAccountId(request.getResponseByAccountId())
                .requestTypeId(request.getRequestTypeId())
                .taskId(request.getTaskId())
                .requestId(request.getRequestId())
                .eventId(request.getEventId())
                .departmentId(request.getDepartmentId())
                .requestByAccountId(request.getRequestByAccountId())
                .requestByUsername(requestByAccount.getUsername())
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

