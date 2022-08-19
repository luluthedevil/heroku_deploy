import React, { useContext, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import PropTypes from 'prop-types';
import Input from '../Input/Input';

import { Context } from '../../context/loginContext';

import './style.css';

import 'react-toastify/dist/ReactToastify.css';

function AdminForm({
  screenName, buttonName,
}) {
  const { setToken, setUserEmail, setIsAdmin } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const notifyError = (message) => toast.error(message);

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    await axios.post('http://localhost:5005/admin/login', {
      email,
      password,
    }).then((response) => {
      setToken(response.data.token);
      setUserEmail(email);
      setIsAdmin(response.data.isAdmin);
    }).catch((err) => {
      notifyError(err.response.data.message);
    });
  };

  return (
    <div className="container-small">
      <div className="container-wrap">
        <form className="form">
          <span className="form-title">
            {screenName}
          </span>

          <Input inputType="email" placeholder="Email" value={email} setValue={handleEmailChange} />
          <Input inputType="password" placeholder="Senha" value={password} setValue={handlePasswordChange} />

          <div className="container-form-btn">
            <button type="submit" className="form-btn" onClick={handleFormSubmit}>{buttonName}</button>
          </div>

        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

AdminForm.propTypes = {
  screenName: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
};

export default AdminForm;
