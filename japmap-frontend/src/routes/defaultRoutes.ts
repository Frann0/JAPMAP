import { IRoute } from "./IRoute";
import ProjectPage from "../pages/Project/Project";

export const DefaultRoutes: IRoute[] = [
  {
    path: "/projekter",
    component: ProjectPage,
    name: "Projekter",
  },
];
