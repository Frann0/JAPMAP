import React from "react";
import { Outlet, Link } from "react-router-dom";
import { DefaultRoutes } from "../routes/defaultRoutes";
import "./default_layout.scss";

const Default_Layout = () => {
  return (
    <>
      <div className="Default">
        <div className="Default_Sidebar">
          <p className="Default_SidebarTitle">JAPMAP</p>
          <div className="Default_SidebarLinks">
            {
              DefaultRoutes.map((route) => (
                <Link to={route.path} className="Default_SidebarLinks_Link">
                  {route.name}
                </Link>
              ))}
          </div>
        </div>
        <div className="Default_Content">
          <div className="Default_ContentWrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Default_Layout;
