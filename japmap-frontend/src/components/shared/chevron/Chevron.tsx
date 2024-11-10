import "./Chevron.scss";
import ChevronIcon from "../../../assets/icons/Chevron.svg";
import { useStore } from "../../../stores/store";
import { IMapComponent } from "../../../interfaces/IMapComponent";
import { observer } from "mobx-react-lite";

const Chevron = ({ map }: { map: IMapComponent }) => {
  const { mapStore } = useStore();

  const toggle = () => {
    mapStore.toggleProject(map.project.id);
  };

  return (
    <img
      className={`Chevron ${map.project.open ? "open" : "closed"}`}
      src={ChevronIcon}
      onClick={toggle}
    />
  );
};

export default observer(Chevron);
