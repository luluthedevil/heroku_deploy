import axios from 'axios';
import { toast } from 'react-toastify';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit2 } from 'react-icons/fi';
import PropTypes from 'prop-types';
import '../style.css';
import { useContext, useState } from 'react';
import { FaRegSave } from 'react-icons/fa';
import { Context } from '../../../context/loginContext';

export default function SingleUser({
  id, username, email,
  handleDelete, setUsers,
}) {
  const [edit, setEdit] = useState(false);
  const { token } = useContext(Context);

  const notifyError = (message) => toast.error(message);

  const [userBody, setUserBody] = useState({
    username: '',
    email: '',
  });

  const getAllUsers = () => {
    axios.get('http://localhost:5005/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUsers(response.data);
      }).catch((err) => {
        notifyError(err.response.data.user);
      });
  };

  const handleUserBodyChange = (e) => {
    if (e.target.name === 'username') {
      setUserBody((oldState) => {
        const newUserBody = { email: oldState.email, username: e.target.value };
        return newUserBody;
      });
    } else {
      setUserBody((oldState) => {
        const newUserBody = { email: e.target.value, username: oldState.username };
        return newUserBody;
      });
    }
  };

  const handleUserEdit = (userId) => {
    axios.put(
      `http://localhost:5005/admin/users/${userId}`,
      { ...userBody },
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then(() => {
        getAllUsers();
      }).catch((err) => {
        notifyError(err.response.data);
      });
  };

  return (
    <div className="user">
      <div className="user-title">
        {edit ? (
          <input
            type="text"
            name="username"
            placeholder={username}
            defaultValue={username}
            onChange={(e) => [handleUserBodyChange(e)]}
          />
        ) : (<h3>{username}</h3>)}

        <div className="user-icons">
          {edit ? (
            <button
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() => [setEdit(false), handleUserEdit(id)]}
            >
              <FaRegSave className="edit-icon" size={25} />
            </button>
          ) : (
            <button type="button" data-toggle="modal" data-target="#exampleModal" onClick={() => setEdit(true)}>
              <FiEdit2 className="edit-icon" size={25} />
            </button>
          )}

          <button type="button">
            <RiDeleteBin6Line className="delete-icon" size={25} onClick={() => handleDelete(id)} />
          </button>
        </div>
      </div>
      <div className="user-author">
        {edit ? (
          <input
            type="text"
            name="email"
            placeholder={email}
            defaultValue={email}
            onChange={(e) => [handleUserBodyChange(e)]}
          />
        ) : (<span>{email}</span>)}

      </div>
    </div>
  );
}

SingleUser.propTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setUsers: PropTypes.func.isRequired,
};
