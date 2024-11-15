import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.scss";
import { DefaultRoutes } from "./routes/defaultRoutes";
import Default_Layout from "./layouts/default_layout";
import Auth_Layout from "./layouts/auth_layout";
import { AuthRoutes } from "./routes/authRoutes";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from "./stores/store";
import { observer } from "mobx-react-lite";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStore } = useStore();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (location.pathname === '/auth/login' || location.pathname === '/auth/signup') {
        navigate('/projekter');
      }

      if (authStore.user === null) {
        authStore.setUser(user);
      }
    }
  })

  return (
    <>
      <Routes>
        <Route path="/" element={<Default_Layout />}>
          {DefaultRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
        <Route path="/auth" element={<Auth_Layout />}>
          {AuthRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default observer(App);
