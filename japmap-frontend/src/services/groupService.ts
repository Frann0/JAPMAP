import http from "../../http-common.ts"

export const createGroup = async (name: string, userId: string) => {
  const response = await http.post("/group/create", { name, userId });
  return response.data;
}

export const getGroups = async () => {
  const response = await http.get("/group/");
  return response.data;
}

export const addUserToGroup = async (groupId: number, userId: string) => {
  const response = await http.post("/group/join", { groupId, userId });
  return response.data;
}

export const removeUserFromGroup = async (groupId: number, userId: string) => {
  const response = await http.post("/group/leave", { groupId, userId });
  return response.data;
}

export const addProjectToGroup = async (groupId: number, userId: string, gitlabUrl: string) => {
  const response = await http.post("/group/addProject", {
    groupId,
    userId,
    gitlabUrl,
  });
  return response.data;
}


