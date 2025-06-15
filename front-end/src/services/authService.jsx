import Api from "../config/Api";

export const login = (loginForm) => {
  return Api.post('/public/login', loginForm);
};

export const logout = async () => {
  try {
    const token = sessionStorage.getItem("token");

    // Call backend to invalidate the token (blacklist it)
    const response = await Api.post("/public/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear session storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");

    console.log("Logout successful");

    return response.data; // return success
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed. Please try again.");
  }
};
