import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
