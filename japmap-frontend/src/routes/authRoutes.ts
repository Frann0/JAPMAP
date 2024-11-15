import { IRoute } from "../routes/IRoute";
import LoginPage from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";


export const AuthRoutes: IRoute[] = [
  {
    path: "/auth",
    component: LoginPage,
    name: "Login",
  },
  {
    path: "/auth/signup",
    component: Signup,
    name: "Signup",
  }
]
