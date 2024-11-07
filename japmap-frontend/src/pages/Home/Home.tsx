import React, { FC } from "react";
import "./Home.scss";
import { useStore } from "../../stores/store";
import { IMapComponent } from "../../interfaces/IMapComponent";
import MapComponent from "../../components/MapComponent/MapComponent";
import Title from "../../components/shared/Title/Title";

const HomePage: FC = () => {
  const { mapStore } = useStore();

  return (
    <div className="HomePage">
      <Title title="Projekter" />
      <div className="HomePage_Content">
        {mapStore.mappings.map((mapping: IMapComponent) => (
          <MapComponent map={mapping} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
