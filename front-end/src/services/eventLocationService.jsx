import Api from "../config/Api";

export const getAllLocations = async () => {
    try {
        const response = await Api.get("/location");
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
    }
};

export const getLocationById = async (locationId) => {
    try {
        const response = await Api.get(`/location/${locationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching location:", error);
        return [];
    }
};