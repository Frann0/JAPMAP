import React from "react";
import { ITitle } from "../../../interfaces/ITitle";
import "./Title.scss";

const Title = ({ title }: ITitle) => {
  return (
    <div className="Title">
      <h1 className="Title_Header">{title}</h1>
      <div className="Title_Divider"></div>
    </div>
  );
};

export default Title;
