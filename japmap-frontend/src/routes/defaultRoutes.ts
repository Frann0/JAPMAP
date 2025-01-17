import { IRoute } from "./IRoute";
import ProjectPage from "../pages/Project/Project";
import UserPage from "../pages/User/UserPage";
import GroupsPage from "../pages/Groups/Groups";
import GroupIDPage from "../pages/GroupPage/GroupPage";

export const DefaultRoutes: IRoute[] = [
  {
    path: "/projekter",
    component: ProjectPage,
    name: "Projekter",
    internal: false,
  },
  {
    path: "/user/:id",
    component: UserPage,
    name: "Bruger",
    internal: true,
  },
  {
    path: "/Groups",
    component: GroupsPage,
    name: "Grupper",
    internal: false,
  },
  {
    path: "/Groups/:id",
    component: GroupIDPage,
    name: "Gruppe",
    internal: true,
  },
];
