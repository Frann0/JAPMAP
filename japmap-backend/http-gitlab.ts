import axios from "axios";

export const gitlab = axios.create({
  baseURL: "https://gitlab.com/api/v4",
  headers: {
    "Private-Token": process.env.GITLAB_PRIVATE_TOKEN,
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});
