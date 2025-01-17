import { IUserDTO } from "../services/authService";
import { IMapComponent, IProject } from "./IMapComponent";

export interface IGroup {
  id: number;
  name: string;
  users: IUserDTO[];
  projects: IMapComponent[];
}
