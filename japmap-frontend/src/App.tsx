import { Routes, Route } from "react-router-dom";
import "./App.scss";
import { DefaultRoutes } from "./routes/defaultRoutes";
import Default_Layout from "./layouts/default_layout";

function App() {
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
      </Routes>
    </>
  );
}

export default App;
