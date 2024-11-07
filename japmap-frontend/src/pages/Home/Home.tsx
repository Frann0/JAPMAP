import React, { FC } from "react";
import "./Home.scss";
import { useStore } from "../../stores/store";
import { IMapComponent } from "../../interfaces/IMapComponent";
import MapComponent from "../../components/MapComponent/MapComponent";

const HomePage: FC = () => {
  const { mapStore } = useStore();

  return (
    <div className="HomePage">
      <h1>Should stick</h1>
      <div className="HomePage_Content">
        {mapStore.mappings.map((mapping: IMapComponent) => (
          <MapComponent map={mapping} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
