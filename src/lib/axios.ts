import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://mathreview-alp-1105650430.ap-northeast-2.elb.amazonaws.com/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

export default axiosInstance;