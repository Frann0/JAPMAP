import React from "react";
import "./NomadComponent.scss";
import Icon from "../shared/icon/Icon";
import { ENomadStatus, INomadInstance } from "../../interfaces/IMapComponent";

const NomadComponent = ({ nomad }: { nomad: INomadInstance }) => {
  const getStatusClass = (status: ENomadStatus) => {
    switch (status) {
      case ENomadStatus.HEALTHY:
        return "NomadComponent_ContentStatus_Running";
      case ENomadStatus.STOPPED:
        return "NomadComponent_ContentStatus_Stopped";
      default:
        return "NomadComponent_ContentStatus_Running";
    }
  };

  const transformStatus = (status: ENomadStatus) => {
    const s = status.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="NomadComponent">
      <div className="NomadComponent_Indent"></div>
      <div className="NomadComponent_Content">
        <Icon icon={nomad.icon} />
        <p className="NomadComponent_ContentName">{nomad.name}</p>
        <p
          className={`NomadComponent_ContentStatus ${getStatusClass(nomad.status)}`}
        >
          {transformStatus(nomad.status)}
        </p>
      </div>
    </div>
  );
};

export default NomadComponent;
