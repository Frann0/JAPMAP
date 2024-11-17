import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { DefaultRoutes } from "../routes/defaultRoutes";
import "./default_layout.scss";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import User from "../components/User/User";

const Default_Layout = () => {
  const { authStore } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    authStore.logout().then(() => {
      navigate('/auth')
    });
  }

  return (
    <>
      <div className="Default">
        <div className="Default_Sidebar">
          <p className="Logo">JAPMAP</p>
          <div className="Default_SidebarLinks">
            {
              DefaultRoutes.map((route) => (
                <Link to={route.path} key={route.path} className="Default_SidebarLinks_Link">
                  {route.name}
                </Link>
              ))}
          </div>
          <div className="Default_SidebarUser">
            <User />
            <div onClick={() => handleLogout()} className="Default_SidebarUserLogout">Logout</div>
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

export default observer(Default_Layout);
