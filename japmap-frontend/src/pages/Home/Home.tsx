import React, { FC, useEffect, useState } from "react";
import "./Home.scss";
import { useStore } from "../../stores/store";
import { IMapComponent } from "../../interfaces/IMapComponent";
import MapComponent from "../../components/MapComponent/MapComponent";
import Title from "../../components/shared/Title/Title";
import { observer } from "mobx-react-lite";
import add_circle from '../../assets/icons/add_circle.svg'

const HomePage: FC = () => {
  const { mapStore } = useStore();
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);

  const addProject = async () => {
    setLoading(true);
    await mapStore.fetchMapping(input).then(() => {
      setInput("");
      setShowModal(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    mapStore.fetchAllMappings();
  }, []);

  return (
    <>
      {showModal && (
        <div className="Add_Modal" onClick={() => setShowModal(false)}>
          <div className="Add_ModalContent" onClick={(e) => e.stopPropagation()}>
            <Title title="Tilføj Projekt" />
            <div className="Add_ModalContent_Container">
              <p className="Add_ModalContent_ContainerText">
                For at tilføje et projekt, udfyldes nedenstående input felt, med link til projektet på gitlab.
                <br />
                <br />
 For at kunne finde nomad instanserne for projektet, skal der laves en CI/CD variable med prefixet 
                Nomad instanserne, ved navn JAPMAP_PREFIX. Hvis ikke den er der, vil processen fejle.
              </p>
              <div className="Add_ModalContent_ContainerInput">
                <input type="text" className="input" placeholder="Gitlab Link" onChange={(e) => setInput(e.target.value)} />
              </div>
            </div>
            <div className="Add_ModalContent_Buttons">
              <button className="button cancel" onClick={() => setShowModal(false)}>Annuller</button>
              <button className="button confirm" onClick={() => addProject()}>{loading ? <div className="Spinner_White" /> : "Bekræft"}</button>
            </div>
          </div>
        </div>                 
              )}
<div className="HomePage">
  <Title title="Projekter" />
  <div className="HomePage_Add" onClick={() => setShowModal(true)}>
    <img src={add_circle} className="HomePage_AddIcon" />
    <p className="HomePage_AddText">Tilføj projekt</p>
  </div>
  <div className="HomePage_Content">
    {mapStore.mappings.map((mapping: IMapComponent) => (
      <MapComponent map={mapping} />
    ))}
  </div>
</div>
    </>
  );
};

export default observer(HomePage);
