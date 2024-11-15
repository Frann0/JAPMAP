import http from "../../http-common.ts";

export interface IUserDTO {
  displayName: string;
  email: string;
  localId: string;
  emailVerified: boolean;
}

export const signUp = async (user: IUserDTO) => {
  console.log(user)
  const response = await http.post("/signup", user);
  return response.data;
}
