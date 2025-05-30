import Api from "../config/Api";

export const getImages = () => Api.get("/document");
