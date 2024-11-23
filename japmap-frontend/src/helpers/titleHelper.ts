import { DefaultRoutes } from "../routes/defaultRoutes"
import { AuthRoutes } from "../routes/authRoutes";
import { matchPath } from "react-router";

export const titleHelper = (path: string) => {

  const name = DefaultRoutes.find((route) => matchPath({ path: route.path }, path))?.name
    || AuthRoutes.find((route) => matchPath({ path: route.path }, path))?.name
    || "JapMap";

  return name;
}
