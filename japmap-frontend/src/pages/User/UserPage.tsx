import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import Title from "../../components/shared/Title/Title";
import './UserPage.scss';
import { useState } from "react";
import Input from "../../components/shared/input/input";
import toast from "react-hot-toast";
import { ToastStyle } from "../../helpers/toastStyles";


const UserPage = () => {
  const { authStore } = useStore();
  const [image, setImage] = useState<string | undefined>(authStore.user?.photoURL);
  const [displayName, setDisplayName] = useState<string | undefined>(authStore.user?.displayName);
  const [email, setEmail] = useState<string | undefined>(authStore.user?.email);
  const [gitlabToken, setGitlabToken] = useState<string | undefined>(localStorage.getItem("X-Gitlab-Token"));
  const [nomadToken, setNomadToken] = useState<string | undefined>(localStorage.getItem("X-Nomad-Token"));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    toast.promise(authStore.updateProfile(displayName!, image!), {
      loading: "Updating profile...",
      success: "Profile updated!",
      error: "Error updating profile"
    }, ToastStyle());
    localStorage.setItem("X-Gitlab-Token", gitlabToken || "");
    localStorage.setItem("X-Nomad-Token", nomadToken || "");
    setLoading(false);
  }



  return (
    <div className="UserPage">
      <Title title="Rediger Bruger" />
      <div className="UserPage_Container">

        <div className="UserPage_ContainerGeneral">
          <div className="UserPage_ContainerTitle">
            <p className="UserPage_ContainerTitleText">Generelle indstillinger</p>
          </div>
          <div className="UserPage_ContainerGeneralWrapper">
            <div className="UserPage_ContainerGeneralWrapperImage">
              <img src={image} alt="user" className='User_Image' />
            </div>
            <div className="UserPage_ContainerGeneralWrapperInfo">
              <Input label="Navn" placeholder="Navn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <Input label="Email" disabled={true} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="UserPage_ContainerTokens">
          <div className="UserPage_ContainerTokensTitle">
            <p className="UserPage_ContainerTokensTitleText">Auth Tokens</p>
          </div>
          <div className="UserPage_ContainerTokensWrapper">
            <Input label="Gitlab Token" placeholder="Gitlab Token" value={gitlabToken} onChange={(e) => setGitlabToken(e.target.value)} />
            <Input label="Nomad Token" placeholder="Nomad Token" value={nomadToken} onChange={(e) => setNomadToken(e.target.value)} />
          </div>
        </div>
        <div className="UserPage_ContainerButtons">
          <button className="UserPage_ContainerButtonsSave" onClick={() => handleSave()}>{loading ? <div className="Spinner_Primary" /> : "Gem"}</button>
        </div>
      </div >
    </div>
  );
}

export default observer(UserPage);
