import axiosInstance from "../api/axiosInstance";
import { ADD_DNS_API } from "../api/endpoints";


export const add_dns_data = async () => {
    try {
        const res = await axiosInstance.get(ADD_DNS_API.DNS_PAGE_API);
        console.log(res);
        if (res.data.success === true) {
            return res.data.data;
        } else {
            throw new Error(res.data.message || "Failed to fetch domains");
        }
    } catch (err) {
        throw err;
    }
};
