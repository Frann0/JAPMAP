import http from "../../http-common";

export const getMapping = async (gitlabURL: string) => {
  const response = await http.post("/test", { gitlabURL });
  return response.data;
};
