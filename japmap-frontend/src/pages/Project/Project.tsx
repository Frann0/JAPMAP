import React, { FC, useEffect, useState } from "react";
import "./Project.scss";
import { useStore } from "../../stores/store";
import { IMapComponent } from "../../interfaces/IMapComponent";
import MapComponent from "../../components/MapComponent/MapComponent";
import Title from "../../components/shared/Title/Title";
import { observer } from "mobx-react-lite";
import add_circle from '../../assets/icons/add_circle.svg'
import Input from "../../components/shared/input/input";

const ProjectPage: FC = () => {
  const { mapStore, authStore } = useStore();
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);

  const addProject = async () => {
    console.log(authStore.user)
    setLoading(true);
    if (!authStore.user) {
      return;
    }

    await mapStore.addMapping(input, authStore.user!.uid).then(() => {
      setInput("");
      setShowModal(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!authStore.user) {
      return;
    }
    mapStore.fetchAllMappings(authStore.user!.uid);
  }, [authStore.user]);

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
              <Input label="Gitlab link til projekt" placeholder="Gitlab Link" onChange={(e) => setInput(e.target.value)} />
            </div>
            <div className="Add_ModalContent_Buttons">
              <button className="button cancel" onClick={() => setShowModal(false)}>Annuller</button>
              <button className="button confirm" onClick={() => addProject()}>{loading ? <div className="Spinner_White" /> : "Bekræft"}</button>
            </div>
          </div>
        </div>
      )}
      <div className="Project">
        <Title title="Projekter" />
        <div className="Project_Add" onClick={() => setShowModal(true)}>
          <img src={add_circle} className="Project_AddIcon" />
          <p className="Project_AddText">Tilføj projekt</p>
        </div>
        <div className="Project_Content">
          {mapStore.mappings.map((mapping: IMapComponent) => (
            <MapComponent map={mapping} />
          ))}
        </div>
      </div>
    </>
  );
};

export default observer(ProjectPage);

