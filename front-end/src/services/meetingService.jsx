// src/services/meetingService.jsx

import Api from "../config/Api";

const MEETING_URL = "/meetings";

export const getAllMeetings = async () => {
  const response = await Api.get(MEETING_URL);
  return response.data;
};

export const getMeetingById = async (id) => {
  const response = await Api.get(`${MEETING_URL}/${id}`);
  return response.data;
};

export const getMeetingByAccountId = async (accountId, filters) => {
  const params = new URLSearchParams();

  if (filters?.searchTitle) params.append("searchTitle", filters.searchTitle);
  if (filters?.eventId) params.append("eventId", filters.eventId);
  if (filters?.page != null) params.append("page", filters.page);
  if (filters?.size != null) params.append("size", filters.size);

  const response = await Api.get(
    `${MEETING_URL}/account/${accountId}?${params.toString()}`
  );
  console.log("alo", response.data);
  
  return response.data;
};

export const createMeeting = async (meeting) => {
  const response = await Api.post(MEETING_URL, meeting);
  return response.data;
};

export const updateMeeting = async (id, meeting) => {
  const response = await Api.put(`${MEETING_URL}/${id}`, meeting);
  return response.data;
};

export const deleteMeeting = async (id) => {
  await Api.delete(`${MEETING_URL}/${id}`);
};

export const getMeetingsByOrganizer = async (accountId) => {
  const response = await Api.get(`${MEETING_URL}/organizer/${accountId}`);
  return response.data;
};

export const getMeetingsByDepartment = async (departmentId) => {
  const response = await Api.get(`${MEETING_URL}/department/${departmentId}`);
  return response.data;
};

export const getMeetingsByEvent = async (eventId) => {
  const response = await Api.get(`${MEETING_URL}/event/${eventId}`);
  return response.data;
};

export const getMeetingsByStatus = async (status) => {
  const response = await Api.get(`${MEETING_URL}/status/${status}`);
  return response.data;
};
