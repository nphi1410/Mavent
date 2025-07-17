import Api from "../config/Api";

export const getSponsors = async () => {
  try {
    const response = await Api.get("/sponsors");
    return response.data;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return [];
  }
};

export const getSponsorById = async (id) => {
  try {
    const response = await Api.get(`/sponsors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sponsor with ID ${id}:`, error);
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
