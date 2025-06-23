import Api from "../config/Api";

export const getRequestsByEventId = async (eventId) => {
    try {
        const response = await Api.get(`/event/${eventId}/request`);
        // console.log("requestService.getRequestsByEventId:", response.data);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const getRequestsByEventIdAndAccountId = async (eventId, accountId) => {
    try {
        const response = await Api.get(`/event/${eventId}/request/account/${accountId}`);
        return response.data;
    } catch (err) {
        console.log("requestService.getRequestsByEventIdAndAccountId:" + err);
        throw err;
    }
}

export const getRequestsByEventIdAndDepartmentId = async (eventId, departmentId) => {
    try {
        const response = await Api.get(`/event/${eventId}/request/department/${departmentId}`);
        return response.data;
    }
    catch (err) {
        console.log("requestService.getRequestsByEventIdAndDepartmentId:" + err);
        throw err;
    }
}

export const getRequestTypes = async () => {
    try {
        const response = await Api.get(`/request-type`);
        return response.data;
    } catch (err) {
        console.log("requestService.getRequestTypes:" + err);
        throw err;
    }
}

export const createRequest = async (eventId, requestData) => {
    try {
        const response = await Api.post(`/event/${eventId}/request/create`, requestData);
        return response.data;
    } catch (err) {
        console.log("requestService.createRequest:" + err);
        throw err;
    }
}

export const updateRequest = async (updateDTO) => {
    const eventId = updateDTO.eventId || 0; // change this if needed
    const requestId = updateDTO.requestId || 0; // change this if needed
    if (!eventId || !requestId) {
        throw new Error("Event ID and Request ID are required for updating a request.");
    }
    const response = await Api.put(`/event/${eventId}/request/${requestId}`, updateDTO);
    return response.data;
};

