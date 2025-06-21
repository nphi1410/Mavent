package com.mavent.dev.service;

import com.mavent.dev.dto.request.CreateRequestDTO;
import com.mavent.dev.dto.request.UpdateRequestDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.entity.Request;

import java.util.List;

public interface RequestService {
    List<Request> getRequestByAccountAndEventId(Integer accountId, Integer eventId);
    List<Request> getRequestsByEventId(Integer eventId);
    Request getRequestByRequestId(Integer requestId);
    boolean addRequest(CreateRequestDTO request);
    boolean updateRequest(UpdateRequestDTO request);

}
