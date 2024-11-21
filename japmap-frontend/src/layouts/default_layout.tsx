import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { DefaultRoutes } from "../routes/defaultRoutes";
import "./default_layout.scss";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import User from "../components/User/User";
import Title from "../components/shared/Title/Title";

const Default_Layout = () => {
  const { authStore } = useStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)
  const [gitlabToken, setGitlabToken] = useState(localStorage.getItem("X-Gitlab-Token") || "");
  const [nomadToken, setNomadToken] = useState(localStorage.getItem("X-Nomad-Token") || "");


  const handleLogout = async () => {
    authStore.logout().then(() => {
      navigate('/auth')
    });
  }

  const setTokens = () => {
    localStorage.setItem("X-Gitlab-Token", gitlabToken);
    localStorage.setItem("X-Nomad-Token", nomadToken);
    setShowModal(false);
  }

  useEffect(() => {
    if (!localStorage.getItem("X-Gitlab-Token") || !localStorage.getItem("X-Nomad-Token")) {
      setShowModal(true);
    }
  }, [localStorage.getItem("X-Gitlab-Token"), localStorage.getItem("X-Nomad-Token")])

  return (
    <>
      {showModal && (
        <div className="Add_Modal">
          <div className="Add_ModalContent" onClick={(e) => e.stopPropagation()}>
            <Title title="Auth Tokens" />
            <div className="Add_ModalContent_Container">
              <p className="Add_ModalContent_ContainerText">
                For at kunne kommunikere med Gitlab og Nomad, skal der tilføjes auth tokens til brugeren.
                <br />
                <br />
                Disse tokens vil blive gemt i localstorage og bruges til at hente data fra de respektive services.
              </p>
              <label htmlFor="gitlab">Gitlab Token</label>
              <div className="Add_ModalContent_ContainerInput">
                <input type="text" className="input" placeholder="Gitlab Token" onChange={(e) => setGitlabToken(e.target.value)} />
              </div>
              <label htmlFor="nomad">Nomad Token</label>
              <div className="Add_ModalContent_ContainerInput">
                <input type="text" className="input" placeholder="Nomad Token" onChange={(e) => setNomadToken(e.target.value)} />
              </div>
            </div>
            <div className="Add_ModalContent_Buttons">
              <button className="button confirm" disabled={gitlabToken === "" && nomadToken === ""} onClick={() => setTokens()}>Bekræft</button>
            </div>
          </div>
        </div>
      )}
      <div className="Default">
        <div className="Default_Sidebar">
          <p className="Logo">JAPMAP</p>
          <div className="Default_SidebarLinks">
            {
              DefaultRoutes.map((route) => (
                <Link to={route.path} key={route.path} className="Default_SidebarLinks_Link">
                  {route.name}
                </Link>
              ))}
          </div>
          <div className="Default_SidebarUser">
            <User />
            <div onClick={() => handleLogout()} className="Default_SidebarUserLogout">Logout</div>
          </div>
        </div>
        <div className="Default_Content">
          <div className="Default_ContentWrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(Default_Layout);
