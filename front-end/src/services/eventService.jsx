import Api from "../config/Api";

export const getEvents = async () => {
  try {
    const response = await Api.get("/events");
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
