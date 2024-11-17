import { DefaultRoutes } from "../routes/defaultRoutes"
import { AuthRoutes } from "../routes/authRoutes";

export const titleHelper = (path: string) => {

  const name = DefaultRoutes.find((route) => route.path === path)?.name
    || AuthRoutes.find((route) => route.path === path)?.name
    || "JapMap";

  return name;
}
