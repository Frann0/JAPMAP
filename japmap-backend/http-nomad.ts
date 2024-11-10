import axios from "axios";

export const nomad = axios.create({
  baseURL: "http://localhost:4646/v1",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});
