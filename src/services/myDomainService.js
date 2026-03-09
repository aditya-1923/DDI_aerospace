import axiosInstance from "../api/axiosInstance";
import { DOMAIN } from "../api/endpoints";

// export const my_domain_list = (data) => { 
//   return axiosInstance.get(DOMAIN.MY_DOMAIN, data);
// };


export const my_domain_list = async () => {
  try {
    const res = await axiosInstance.get(DOMAIN.MY_DOMAIN);
    if (res.data.status === "success") {
      
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Failed to fetch domains");
    }
  } catch (err) {
    throw err;
  }
};
