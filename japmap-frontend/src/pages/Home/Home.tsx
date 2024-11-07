import React, { FC } from "react";
import "./Home.scss";

const HomePage: FC = () => {
  return (
    <div className="HomePage">
      <h1>Should stick</h1>
      <div className="HomePage_Content">
        <div> Column 1</div>
        <div> Column 1</div>
        <div> Column 1</div>
        <div> Column 1</div>
        <div> Column 1</div>
      </div>
    </div>
  );
};

export default HomePage;
