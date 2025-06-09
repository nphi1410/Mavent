import Api from "../config/Api";

export const getImages = async () => {
  try {
    const response = await Api.get("/document");
    return response.data;
  } catch (error) {
    console.error("Error fetching document:", error);
    return [];
  }
};
