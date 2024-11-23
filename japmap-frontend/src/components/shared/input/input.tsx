import { observer } from 'mobx-react-lite';
import './input.scss';

interface IInput {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
}

const Input = ({ placeholder, onChange, type, label, value, disabled }: IInput) => {

  return (
    <div className='Input'>
      {label ? <label htmlFor={label} className='Input_Label'>{label}</label> : null}
      <div className='Input_Container'>
        <input type={type ? type : 'text'} value={value ? value : ''} disabled={disabled ? disabled : false} className="input" placeholder={placeholder} onChange={onChange} />
      </div>
    </div>
  );
}

export default observer(Input);

