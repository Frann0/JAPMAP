import { observer } from "mobx-react-lite";
import React from "react";
import { IGroup } from "../../interfaces/IGroup";
import { Link } from "react-router-dom";

const Group = observer(({ group }: { group: IGroup }) => {
  return (
    <div className="Group">
      <p className="Group_Name">{group.name}</p>
      <Link to={`/Groups/${group.id}`} className="Group_Link">
        Gå til Gruppe
      </Link>
    </div>
  );
});

export default Group;
