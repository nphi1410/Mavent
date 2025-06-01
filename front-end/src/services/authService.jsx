import Api from "../config/Api";

export const login = (loginForm) => {
  return Api.post('/login', loginForm);
};