package com.mavent.dev.mapper;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.*;

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
}

