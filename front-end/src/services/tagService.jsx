import Api from "../config/Api";

export const getTags = async ({ eventId }) => {
  try {
    const response = await Api.get("/tags", { params: { eventId } });
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};
