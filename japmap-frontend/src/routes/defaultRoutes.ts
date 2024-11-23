import { IRoute } from "./IRoute";
import ProjectPage from "../pages/Project/Project";
import UserPage from "../pages/User/UserPage";

export const DefaultRoutes: IRoute[] = [
  {
    path: "/projekter",
    component: ProjectPage,
    name: "Projekter",
    internal: false
  },
  {
    path: "/user/:id",
    component: UserPage,
    name: "Bruger",
    internal: true
  }
];
