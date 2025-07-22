package com.mavent.dev.service;

import com.mavent.dev.entity.RequestType;

import java.util.List;

public interface RequestTypeService {
    RequestType getRequestTypeById(int requestTypeId);
    List<RequestType> getRequestTypes();
    RequestType addRequestType(RequestType requestType);

    RequestType updateRequestType(int requestTypeId, RequestType requestType);
    void deleteRequestType(int requestTypeId);

}
