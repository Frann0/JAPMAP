import React from "react";
import "./Icon.scss";
import Gitlab from "../../../assets/icons/gitlab.svg";
import Nomad from "../../../assets/icons/nomad.svg";
import { EIcon } from "../../../interfaces/IMapComponent";

const Icon = ({ icon }: { icon: EIcon }) => {
  const getIcon = (icon: EIcon) => {
    switch (icon) {
      case EIcon.GITLAB:
        return Gitlab;
      case EIcon.NOMAD:
        return Nomad;

      default:
        return Gitlab;
    }
  };

  return <img className="Icon" src={getIcon(icon)} />;
};

export default Icon;
