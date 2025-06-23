import Api from '../config/Api';

export const getUserInfoInEvent = async (eventId) => {
  try {
    const response = await Api.get(`/events/${eventId}/user`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user department in event ID ${eventId}:`, error);
    return null;
  }
}

