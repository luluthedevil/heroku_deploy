import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import PropTypes from 'prop-types';
import Input from '../Input/Input';

import { Context } from '../../context/loginContext';

import './style.css';

import 'react-toastify/dist/ReactToastify.css';

function Form({
  screenName, buttonName, bottomMessage, formType,
}) {
  const { setToken, setUserEmail } = useContext(Context);
  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formType === 'login') {
      await axios.post('http://localhost:5005/users/login', {
        email,
        password,
      }).then((response) => {
        setToken(response.data.token);
        setUserEmail(email);
      }).catch((err) => {
        notifyError(err.response.data.message);
      });
    } else {
      await axios.post('http://localhost:5005/users/', {
        username,
        email,
        password,
      }).then(() => {
        notifySuccess('Conta criada com sucesso!');
        notifySuccess(`Um email de confirmação foi enviado para: ${email}`);
        history('/');
      }).catch((err) => {
        notifyError(err.response.data.message);
      });
    }
  };

  return (
    <div className="container-small">
      <div className="container-wrap">
        <form className="form">
          <span className="form-title">
            {screenName}
          </span>

          {formType === 'login' ? (
            <>
              <Input inputType="email" placeholder="Email" value={email} setValue={handleEmailChange} />
              <Input inputType="password" placeholder="Senha" value={password} setValue={handlePasswordChange} />
            </>
          ) : (
            <>
              <Input inputType="text" placeholder="Username" value={username} setValue={handleUsernameChange} />
              <Input inputType="email" placeholder="Email" value={email} setValue={handleEmailChange} />
              <Input inputType="password" placeholder="Senha" value={password} setValue={handlePasswordChange} />
            </>
          )}

          <div className="container-form-btn">
            <button type="submit" className="form-btn" onClick={handleFormSubmit}>{buttonName}</button>
          </div>
          <div className="text-center">
            <span className="txt-1">{bottomMessage[0]}</span>
            <Link to={bottomMessage[2]} className="txt-2">{bottomMessage[1]}</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

Form.propTypes = {
  screenName: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  bottomMessage: PropTypes.array.isRequired,
  formType: PropTypes.string.isRequired,
};

export default Form;
