import http from "../../http-common";

export const addMapping = async (gitlabURL: string, userId: string) => {
  const response = await http.post("/addMap", { gitlabURL, userId });
  return response.data;
};

export const getAllMappings = async (userId: string) => {
  console.log(userId);
  const response = await http.get("/getMaps", { params: { userId } }).catch((err) => {
    console.log(err);
  })
  return response.data;
}
