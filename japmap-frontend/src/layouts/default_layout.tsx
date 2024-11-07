import React from "react";
import { Outlet } from "react-router-dom";

const Default_Layout = () => {
  return (
    <>
      <h1>Default Layout</h1>
      <Outlet />
    </>
  );
};

export default Default_Layout;
