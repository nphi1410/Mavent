import Api from "../config/Api";

export const getAllAccounts = async () => {
  try {
    const response = await Api.get("/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
};

export const getAccountById = async (id) => {
  try {
    const response = await Api.get(`/accounts/${id}`);

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching account with ID ${id}:`, error);
    return null;
  }
};
