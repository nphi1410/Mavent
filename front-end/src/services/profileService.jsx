import Api from "../config/Api";


export const getUserProfile = () => Api.get("/user/profile");

export const updateProfile = (data) => Api.put("/user/profile", data);

export const uploadAvatar = (formData) => Api.post("/user/avatar", formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getAllAccounts = () => Api.get("/accounts");