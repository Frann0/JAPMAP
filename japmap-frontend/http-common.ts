import axios from "axios";

const axiosIntance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASEURL}`,
  headers: {
    "Content-type": "application/json",
  },
});

axiosIntance.interceptors.request.use(async (config) => {
  config.headers["X-Nomad-Token"] = `${localStorage.getItem("X-Nomad-Token")}`;
  config.headers["X-Gitlab-Token"] = `${localStorage.getItem("X-Gitlab-Token")}`;
  return config;
});

export default axiosIntance;
