import { observer } from "mobx-react-lite"
import { useStore } from "../../stores/store";
import { Link } from "react-router-dom";
import { useState } from "react";
import './Signup.scss'


const SignUp = () => {
  const { authStore } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {

    if (password !== confirmPassword) {
      setError('Passwords er ikke ens');
      return;
    }
    authStore.signup(email, password, firstName, lastName);
  }

  return (
    <div className='Signup'>
      <div className='Signup_Title'>
        <p className='SignUp_TitleText'>Opret Bruger</p>
      </div>
      <div className="Signup_Error">
        <p className="Signup_ErrorText">{error}</p>
      </div>
      <div className='Signup_Form'>
        <div className='Signup_Form_InputContainer'>
          <input className='input' type="text" placeholder='Fornavn' onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className='Signup_Form_InputContainer'>
          <input className='input' type="text" placeholder='Efternavn' onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className='Signup_Form_InputContainer'>
          <input className='input' type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='Signup_Form_InputContainer'>
          <input className='input' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='Signup_Form_InputContainer'>
          <input className='input' type="password" placeholder='Bekræft Password' onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button className='Signup_Form_Button' onClick={() => handleSignUp()}>Opret</button>
      </div>
      <div className='Signup_Signup'>
        <p className='Signup_Signup_Text'>Har du allerede en bruger?</p>
        <Link to="/auth" className='Signup_Signup_Link'>Log ind</Link>
      </div>
    </div >

  )

}

export default observer(SignUp)
