import { Outlet } from 'react-router-dom';
import './auth_layout.scss';
import '../assets/global.scss';


const Auth_Layout = () => {

  return (
    <>
      <div className="AuthLayout">
        <nav className="AuthLayout_Nav">
          <p className='Logo'>JAPMAP</p>
        </nav>
        <div className="AuthLayout_Content">
          <Outlet />
        </div>
      </div>
    </>

  )
}

export default Auth_Layout;
