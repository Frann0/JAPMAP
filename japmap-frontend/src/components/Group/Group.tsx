import { observer } from "mobx-react-lite";
import React from "react";
import { IGroup } from "../../interfaces/IGroup";
import { Link } from "react-router-dom";
import { useStore } from "../../stores/store";
import './Group.scss'

const Group = observer(({ group }: { group: IGroup }) => {

  const { authStore, groupStore } = useStore();

  const userInGroup = () => {
    return group.users.find(user => user.id === authStore.user?.uid) !== undefined;
  }

  return (
    <div className="Group">
      <p className="Group_Name">{group.name}</p>
      <div className="Group_Info">
        <p className="Group_Info_Label">Medlemmer</p>
        <p className="Group_Info_Count">{group.users ? group.users.length : 0}</p>
      </div>
      <div className="Group_Info">
        <p className="Group_Info_Label">Projekter</p>
        <p className="Group_Info_Count">{group.projects.length}</p>
      </div>
      {userInGroup() ?
        <Link to={`/Groups/${group.id}`} className="Group_Link">
          Gå til Gruppe
        </Link>
        : <button onClick={() => groupStore.joinGroup(group.id, authStore.user!.uid)} className="Group_Link">Bliv Medlem</button>
      }
    </div>
  );
});

export default Group;
