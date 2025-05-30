import Api from './../config/Api';

export const getGreeting = () => Api.get("/greeting");

export const submitExample = (data) => Api.post("/submit", data);
