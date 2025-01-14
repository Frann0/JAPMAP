import { observer } from "mobx-react-lite";
import "./GroupPage.scss";
import { useLocation, useParams } from "react-router-dom";

const GroupIDPage = observer(() => {
  const params = useParams();

  return <div>GroupIDPage {params.id}</div>;
});

export default GroupIDPage;
