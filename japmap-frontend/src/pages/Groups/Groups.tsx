import { observer } from "mobx-react-lite";
import "./Groups.scss";
import Title from "../../components/shared/Title/Title";
import Group from "../../components/Group/Group";
import { IGroup } from "../../interfaces/IGroup";
import { useStore } from "../../stores/store";
import { useEffect, useState } from "react";
import Input from "../../components/shared/input/input";
import add_circle from '../../assets/icons/add_circle.svg'

const GroupsPage = observer(() => {
  const [showModal, setShowModal] = useState(false)
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { groupStore, authStore } = useStore();

  useEffect(() => {
    groupStore.getGroups();
  }, [])

  const addGroup = async () => {
    setLoading(true);

    if (!authStore.user) {
      setLoading(false);
      setShowModal(false);
      setInput("");
      return;
    }

    await groupStore.createGroup(input, authStore.user.uid).then(() => {
      setInput("");
      setShowModal(false);
      setLoading(false);
    });

  }


  return (
    <>
      {showModal && (
        <div className="Add_Modal" onClick={() => setShowModal(false)}>
          <div
            className="Add_ModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <Title title="Opret Gruppe" />
            <div className="Add_ModalContent_Container">
              <p className="Add_ModalContent_ContainerText">
                Indtast navnet på den nye gruppe du vil oprette. Du vil automatisk blive tilføjet som medlem af gruppen.
              </p>
              <Input
                label="Gruppe Navn"
                value={input}
                placeholder="Gruppe Navn"
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
              <button className="button confirm" onClick={() => addGroup()}>
                {loading ? <div className="Spinner_White" /> : "Bekræft"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="Groups">
        <Title title="Grupper" />
        <div className="Groups_Add" onClick={() => setShowModal(true)}>
          <img src={add_circle} className="Groups_AddIcon" />
          <p className="Groups_AddText">Opret ny gruppe</p>
        </div>
        <div className="Groups_Content">
          {groupStore.groups.map((group: IGroup) => (
            <Group key={group.id} group={group} />
          ))}
        </div>
      </div>
    </>
  );
});

export default GroupsPage;
