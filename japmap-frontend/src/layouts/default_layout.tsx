import React from "react";
import { Outlet } from "react-router-dom";
import "./default_layout.scss";

const Default_Layout = () => {
  return (
    <>
      <div className="Default">
        <div className="Default_SidebarContainer">test</div>
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
