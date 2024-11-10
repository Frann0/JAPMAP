import { observer } from "mobx-react-lite";
import "./MapComponent.scss";
import { IMapComponent } from "../../interfaces/IMapComponent";
import Chevron from "../shared/chevron/Chevron";
import Icon from "../shared/icon/Icon";
import NomadComponent from "../NomadComponent/NomadComponent";

const MapComponent = ({ map }: { map: IMapComponent }) => {
  return (
    <div
      className={`MapComponent ${map.project.open ? "MapComponent_Open" : "MapComponent_Closed"}`}
    >
      <div
        className={`MapComponent_Project ${map.project.open ? "MapComponent_ProjectOpen" : "MapComponent_ProjectClosed"}`}
      >
        <div className="MapComponent_ProjectIcon">
          <Icon icon={map.project.icon} />
        </div>
        <div className="MapComponent_ProjectName">{map.project.name}</div>
        <div className="MapComponent_ProjectInstanceCount">
          {map.project.healthyInstanceCount}/{map.project.instanceCount}
        </div>
        <div className="MapComponent_ProjectChevronContainer">
          <div className="MapComponent_ProjectDivider"></div>
          <Chevron map={map} />
        </div>
      </div>
      <div
        className={`MapComponent_Nomad ${map.project.open ? "MapComponent_Nomad_Open" : "MapComponent_Nomad_Closed"}`}
      >
        <div className="MapComponent_NomadContainer">
          {map.nomadInstances.map((nomad) => (
            <NomadComponent nomad={nomad} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(MapComponent);
