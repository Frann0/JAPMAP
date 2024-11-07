import { IRoute } from "./IRoute";
import HomePage from "../pages/Home/Home";

export const DefaultRoutes: IRoute[] = [
  {
    path: "/",
    component: HomePage,
    name: "Home",
  },
];
