import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.seonlim.site",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

export default axiosInstance;