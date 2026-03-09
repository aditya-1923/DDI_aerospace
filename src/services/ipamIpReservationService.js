import axiosInstance from "../api/axiosInstance";
import { IPAM_IP_RESERVATION } from "../api/endpoints";

// export const subnet_details = (data) => {
//   return axiosInstance.get(IPAM_IP_RESERVATION.SUBNET_DETAILS, data);
// };

export const subnet_details = (params) => {
  return axiosInstance.get(
    IPAM_IP_RESERVATION.SUBNET_DETAILS,
    {
      params,
      withCredentials: true,
    }
  );
};


export const subnet_info = (params) => {
  return axiosInstance.get(
    IPAM_IP_RESERVATION.SUBNET_INFO,
    {
      params,
      withCredentials: true,
    }
  );
};