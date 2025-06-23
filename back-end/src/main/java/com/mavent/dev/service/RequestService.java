package com.mavent.dev.service;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.RequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Request;

import java.util.List;

public interface RequestService {
    List<RequestDTO> getRequestByAccountAndEventId(Integer accountId, Integer eventId);
    List<RequestDTO> getRequestsByEventId(Integer eventId);
    List<RequestDTO> getRequestByEventIdAndDepartmentId(Integer eventId, Integer departmentId);
    Request getRequestByRequestId(Integer requestId);
    boolean addRequest(CreateRequestDTO request);
    boolean updateRequest(UpdateRequestDTO request, Integer requestId);

}
