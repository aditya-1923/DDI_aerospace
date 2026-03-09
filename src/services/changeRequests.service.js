import axiosInstance from "../api/axiosInstance";
import { DOMAIN } from "../api/endpoints";

export const ticket_count = (data) => {
  return axiosInstance.get(DOMAIN.TICKETS_COUNT, data);
};

export const change_requests = (data) => {
  return axiosInstance.get(DOMAIN.CHNAGE_REQUESTS, data);
};

