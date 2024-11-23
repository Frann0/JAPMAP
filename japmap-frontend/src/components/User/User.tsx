import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import './User.scss';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const User = () => {
  const { authStore } = useStore();
  const navigate = useNavigate();


  useEffect(() => {
    if (authStore.user)
      console.log(authStore.user?.photoURL)
  }, [authStore.user])

  const handleClicked = () => {
    navigate(`/user/${authStore.user?.uid}`)
  }

  return (
    <>
      {authStore.user && (
        <div className="User" onClick={() => handleClicked()}>
          <img src={authStore.user.photoURL} alt="user" className='User_Image' />
          <div className='User_Info'>
            <p className='User_Info_DisplayName'>{authStore.user.displayName}</p>
            <p className='User_Info_Email'>{authStore.user.email}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default observer(User);
