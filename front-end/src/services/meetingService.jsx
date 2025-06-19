// src/services/meetingService.jsx

import Api from "../config/Api";

const BASE_URL = "/api/meetings";

export const getAllMeetings = async () => {
  const response = await Api.get(BASE_URL);
  return response.data;
};

export const getMeetingById = async (id) => {
  const response = await Api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createMeeting = async (meeting) => {
  const response = await Api.post(BASE_URL, meeting);
  return response.data;
};

export const updateMeeting = async (id, meeting) => {
  const response = await Api.put(`${BASE_URL}/${id}`, meeting);
  return response.data;
};

export const deleteMeeting = async (id) => {
  await Api.delete(`${BASE_URL}/${id}`);
};

export const getMeetingsByOrganizer = async (accountId) => {
  const response = await Api.get(`${BASE_URL}/organizer/${accountId}`);
  return response.data;
};

export const getMeetingsByDepartment = async (departmentId) => {
  const response = await Api.get(`${BASE_URL}/department/${departmentId}`);
  return response.data;
};

export const getMeetingsByEvent = async (eventId) => {
  const response = await Api.get(`${BASE_URL}/event/${eventId}`);
  return response.data;
};

export const getMeetingsByStatus = async (status) => {
  const response = await Api.get(`${BASE_URL}/status/${status}`);
  return response.data;
};
