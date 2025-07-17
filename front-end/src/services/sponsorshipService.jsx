import Api from "../config/Api";

const baseSponsorshipPackageUrl = "/sponsorship/package";
const baseEventSponsorshipUrl = "/event/sponsorship";

export const getSponsorshipPackages = async () => {
  try {
    const response = await Api.get(baseSponsorshipPackageUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching sponsorship package:", error);
    return [];
  }
};

export const getSponsorshipPackageById = async (id) => {
  try {
    const response = await Api.get(`${baseSponsorshipPackageUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sponsorship package with ID ${id}:`, error);
    return null;
  }
};

export const createSponsorshipPackage = async (packageData) => {
  try {
    const response = await Api.post(baseSponsorshipPackageUrl, packageData);
    return response.data;
  } catch (error) {
    console.error("Error creating sponsorship package:", error);
    return null;
  }
};

export const updateSponsorshipPackage = async (id, packageData) => {
  try {
    const response = await Api.put(
      `${baseSponsorshipPackageUrl}/${id}`,
      packageData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating sponsorship package with ID ${id}:`, error);
    return null;
  }
};

export const deleteSponsorshipPackage = async (id) => {
  try {
    const response = await Api.delete(`${baseSponsorshipPackageUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sponsorship package with ID ${id}:`, error);
    return null;
  }
};

export const getSponsorships = async () => {
  try {
    const response = await Api.get(baseEventSponsorshipUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching sponsorship requests:", error);
    return [];
  }
};

export const getSponsorshipById = async (id) => {
  try {
    const response = await Api.get(`${baseEventSponsorshipUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sponsorship request with ID ${id}:`, error);
    return null;
  }
};

export const createSponsorship = async (sponsorshipData) => {
  try {
    const response = await Api.post(baseEventSponsorshipUrl, sponsorshipData);
    return response.data;
  } catch (error) {
    console.error("Error creating sponsorship request:", error);
    return null;
  }
};

export const updateSponsorship = async (id, sponsorshipData) => {
  try {
    const response = await Api.put(
      `${baseEventSponsorshipUrl}/${id}`,
      sponsorshipData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating sponsorship request with ID ${id}:`, error);
    return null;
  }
};

export const deleteSponsorship = async (id) => {
  try {
    const response = await Api.delete(`${baseEventSponsorshipUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sponsorship request with ID ${id}:`, error);
    return null;
  }
};
