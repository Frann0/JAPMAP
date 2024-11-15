import { IRoute } from "../routes/IRoute";
import LoginPage from "../pages/Login/Login";


export const AuthRoutes: IRoute[] = [
  {
    path: "/auth",
    component: LoginPage,
    name: "Login",
  },
]
