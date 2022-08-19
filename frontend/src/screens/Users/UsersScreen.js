import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Context } from '../../context/loginContext';
import SingleUser from './SingleUser/SingleUser';

import './style.css';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const { token } = useContext(Context);
  const [createUser, setCreateUser] = useState(false);

  const [userBody, setUserBody] = useState({
    username: '',
    email: '',
    password: '',
  });

  const notifyError = (message) => toast.error(message);

  const getAllUsers = () => {
    axios.get('http://localhost:5005/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUsers(response.data);
      }).catch((err) => {
        notifyError(err.response.data.user);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:5005/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUsers(response.data);
      }).catch((err) => {
        notifyError(err.response.data.user);
      });
  }, []);

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:5005/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(() => {
      users.forEach((e, index) => {
        if (e.id === userId) {
          const newUsers = [...users];
          newUsers.splice(index, 1);
          setUsers(newUsers);
        }
      });
    }).catch((err) => {
      notifyError(err.response.data.message);
    });
  };

  const handleUserBodyChange = (e) => {
    if (e.target.name === 'username') {
      setUserBody((oldState) => {
        const newMsgBody = {
          username: e.target.value,
          password: oldState.password,
          email: oldState.email,
        };
        return newMsgBody;
      });
    } else if (e.target.name === 'email') {
      setUserBody((oldState) => {
        const newMsgBody = {
          username: oldState.username,
          password: oldState.password,
          email: e.target.value,
        };
        return newMsgBody;
      });
    } else {
      setUserBody((oldState) => {
        const newMsgBody = {
          username: oldState.username,
          password: e.target.value,
          email: oldState.email,
        };
        return newMsgBody;
      });
    }
  };

  const handleMessageBodySubmit = () => {
    console.log(userBody);
    axios.post(
      'http://localhost:5005/admin/users',
      { ...userBody },
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then(() => {
        getAllUsers();
      });
  };

  return (
    <div className="container">
      <div className="wrap-container">
        <div className="superior-part">
          <h1>
            Users
          </h1>
          <button type="button" onClick={() => setCreateUser((m) => !m)}>
            <AiOutlinePlus size={35} />
          </button>
        </div>

        {createUser
          ? (
            <div className="add-container">
              <div className="input-container">
                <input
                  className="add-input"
                  placeholder="Username"
                  name="username"
                  onChange={handleUserBodyChange}
                />
                <input
                  className="add-input"
                  placeholder="Email"
                  name="email"
                  onChange={handleUserBodyChange}
                />
                <input
                  type="password"
                  className="add-input"
                  placeholder="Senha"
                  name="password"
                  onChange={handleUserBodyChange}
                />
              </div>
              <button
                className="add-button"
                type="button"
                onClick={(e) => [setCreateUser((m) => !m), handleMessageBodySubmit(e)]}
              >
                Salvar
              </button>
            </div>
          )
          : null}

        <div className="content">
          {users.map((user) => (
            <SingleUser
              username={user.username}
              email={user.email}
              key={user.id}
              id={user.id}
              handleDelete={handleDelete}
              setUsers={setUsers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
