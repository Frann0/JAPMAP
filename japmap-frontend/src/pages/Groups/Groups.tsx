import { observer } from "mobx-react-lite";
import "./Groups.scss";
import Title from "../../components/shared/Title/Title";
import Group from "../../components/Group/Group";
import { IGroup } from "../../interfaces/IGroup";

const GroupsPage = observer(() => {
  const group2 = {
    id: 1,
    name: "Gruppe 1",
    users: [],
    projects: [],
  } as IGroup;

  return (
    <div className="Groups">
      <Title title="Grupper" />

      <div className="Groups_Content">
        <Group group={group2} />
      </div>
    </div>
  );
});

export default GroupsPage;
