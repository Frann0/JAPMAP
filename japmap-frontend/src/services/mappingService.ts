import http from "../../http-common";

export const addMapping = async (gitlabURL: string) => {
  const response = await http.post("/test", { gitlabURL });
  return response.data;
};

export const getAllMappings = async () => {
  const response = await http.get("/getMaps");
  return response.data;
}
