import React, { FC, useEffect } from "react";
import "./Home.scss";
import { useStore } from "../../stores/store";
import { IMapComponent } from "../../interfaces/IMapComponent";
import MapComponent from "../../components/MapComponent/MapComponent";
import Title from "../../components/shared/Title/Title";
import { observer } from "mobx-react-lite";

const HomePage: FC = () => {
  const { mapStore } = useStore();
  const [input, setInput] = React.useState("");

  useEffect(() => {
    console.log(mapStore.mappings);
  }, [mapStore.mappings]);

  return (
    <div className="HomePage">
      <Title title="Projekter" />
      <div className="HomePage_Content">
        <div className="TEST_INPUT">
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={() => mapStore.fetchMapping(input)}>
            RUN THAT SHIT
          </button>
        </div>

        {mapStore.mappings.map((mapping: IMapComponent) => (
          <MapComponent map={mapping} />
        ))}
      </div>
    </div>
  );
};

export default observer(HomePage);
