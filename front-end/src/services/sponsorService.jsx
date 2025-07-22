import Api from "../config/Api";

export const getSponsors = async (id) => {
  try {
    const response = await Api.get(`/sponsors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return [];
  }
};

export const getSponsorById = async (id) => {
  try {
    const response = await Api.get(`/sponsors/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sponsor with ID ${id}:`, error);
    return null;
  }
};

export const getSponsorByEventId = async (eventId) => {
  try {
    const response = await Api.get(`/event/sponsorship/public/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sponsor by event ID ${eventId}:`, error);
    return null;
  }
};

export const createSponsor = async (sponsorData) => {
  try {
    const response = await Api.post("/sponsors", sponsorData);
    return response.data;
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return null;
  }
};

export const updateSponsor = async (id, sponsorData) => {
  try {
    const response = await Api.put(`/sponsors/${id}`, sponsorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sponsor with ID ${id}:`, error);
    return null;
  }
};

export const deleteSponsor = async (id) => {
  try {
    const response = await Api.delete(`/sponsors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sponsor with ID ${id}:`, error);
    return null;
  }
};
