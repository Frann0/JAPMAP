import { observer } from "mobx-react-lite";
import "./MapComponent.scss";
import { IMapComponent } from "../../interfaces/IMapComponent";
import Chevron from "../shared/chevron/Chevron";
import Icon from "../shared/icon/Icon";

const MapComponent = ({ map }: { map: IMapComponent }) => {
  return (
    <>
      <div className="MapComponent">
        <div className="MapComponent_ProjectIcon">
          <Icon icon={map.project.icon} />
        </div>
        <div className="MapComponent_ProjectName">{map.project.name}</div>
        <div className="MapComponent_ProjectInstanceCount">
          {map.project.healthyInstanceCount}/{map.project.instanceCount}
        </div>
        <div className="MapComponent_ChevronContainer">
          <div className="MapComponent_Divider"></div>
          <Chevron map={map} />
        </div>
      </div>
    </>
  );
};

export default observer(MapComponent);
