import axiosInstance from "../api/axiosInstance";
import { AUTH } from "../api/endpoints";

export const login = (data) => {
  return axiosInstance.post(AUTH.LOGIN, data);
};

export const register = (data) => {
  return axiosInstance.post(AUTH.REGISTER, data);
};
