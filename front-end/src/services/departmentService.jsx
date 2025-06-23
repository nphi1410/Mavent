import Api from "../config/Api";

export const getDepartments = async (eventId) => {
  try {
    const response = await Api.get("/departments", {
      params: { eventId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};
