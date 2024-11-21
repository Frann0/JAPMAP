import axios from "axios";

export default axios.create({
  baseURL: `${import.meta.env.VITE_API_BASEURL}`,
  headers: {
    "Content-type": "application/json",
    "X-Nomad-Token": `${localStorage.getItem("X-Nomad-Token")}`,
    "X-Gitlab-Token": `${localStorage.getItem("X-Gitlab-Token")}`
  },
});
