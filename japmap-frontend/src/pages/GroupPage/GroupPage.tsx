import { observer } from "mobx-react-lite";
import "./GroupPage.scss";
import { useLocation, useParams } from "react-router-dom";
import { useStore } from "../../stores/store";
import { useEffect, useState } from "react";
import add_circle from "../../assets/icons/add_circle.svg";
import Input from "../../components/shared/input/input";
import Title from "../../components/shared/Title/Title";
import MapComponent from "../../components/MapComponent/MapComponent";
import { transformGroupToMap } from "../../helpers/groupToMapTransform";

const GroupIDPage = observer(() => {
  const params = useParams();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { mapStore, authStore, groupStore, socketStore } = useStore();
  useEffect(() => {
    if (!params.id) {
      return;
    }

    const group = groupStore.findGroupById(Number.parseInt(params.id));

    if (!group) {
      return;
    }

    groupStore.setSelectedGroup(group);
    groupStore.setSelectedGroupProjects(group.projects);
  }, []);

  useEffect(() => {
    socketStore.createSocket();
    socketStore.socket?.addEventListener("message", (event) => {
      console.log(event.data);
      const { jobId, status } = JSON.parse(event.data);
      groupStore.updateStatus(jobId, status);
    });

    return () => {
      socketStore.disconnect();
    };
  }, []);

  const addProject = async () => {
    setLoading(true);

    if (!authStore.user || !params.id) {
      setLoading(false);
      setShowModal(false);
      setInput("");
      return;
    }

    await groupStore
      .addProjectToGroup(Number.parseInt(params.id), authStore.user!.uid, input)
      .then(() => {
        setInput("");
        setShowModal(false);
        setLoading(false);
      });
  };

  return (
    <>
      {groupStore.selectedGroup && (
        <>
          {showModal && (
            <div className="Add_Modal" onClick={() => setShowModal(false)}>
              <div
                className="Add_ModalContent"
                onClick={(e) => e.stopPropagation()}
              >
                <Title title="Tilføj Projekt" />
                <div className="Add_ModalContent_Container">
                  <p className="Add_ModalContent_ContainerText">
                    For at tilføje et projekt, udfyldes nedenstående input felt,
                    med link til projektet på gitlab.
                    <br />
                    <br />
                    For at kunne finde nomad instanserne for projektet, skal der
                    laves en CI/CD variable med prefixet Nomad instanserne, ved
                    navn JAPMAP_PREFIX. Hvis ikke den er der, vil processen
                    fejle.
                  </p>
                  <Input
                    label="Gitlab link til projekt"
                    value={input}
                    placeholder="Gitlab Link"
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <div className="Add_ModalContent_Buttons">
                  <button
                    className="button cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Annuller
                  </button>
                  <button
                    className="button confirm"
                    onClick={() => addProject()}
                  >
                    {loading ? <div className="Spinner_White" /> : "Bekræft"}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="Project">
            <Title
              title={`Gruppeprojekter - ${groupStore.selectedGroup.name}`}
            />
            <div className="Project_Add" onClick={() => setShowModal(true)}>
              <img src={add_circle} className="Project_AddIcon" />
              <p className="Project_AddText">Tilføj projekt</p>
            </div>
            <div className="Project_Content">
              {groupStore.selectedGroupProjects.map((project) => (
                <MapComponent
                  key={project.id}
                  map={project}
                  toggle={() => groupStore.toggleProject(project.project.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default GroupIDPage;
