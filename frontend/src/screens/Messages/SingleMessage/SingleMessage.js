import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit2 } from 'react-icons/fi';
import { FaRegSave } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../style.css';
import { toast } from 'react-toastify';
import { useContext, useState } from 'react';
import { Context } from '../../../context/loginContext';

export default function SingleMessage({
  id, title, author, content,
  handleDelete, setMessages,
}) {
  const [edit, setEdit] = useState(false);
  const { userEmail, token } = useContext(Context);

  const notifyError = (message) => toast.error(message);

  const [messageBody, setMessageBody] = useState({
    title: '',
    content: '',
  });

  const handleMessageBodyChange = (e) => {
    if (e.target.name === 'title') {
      setMessageBody((oldState) => {
        const newMsgBody = { content: oldState.content, title: e.target.value };
        return newMsgBody;
      });
    } else {
      setMessageBody((oldState) => {
        const newMsgBody = { content: e.target.value, title: oldState.title };
        return newMsgBody;
      });
    }
  };

  const getAllMessages = () => {
    axios.get(`http://localhost:5005/messages/getAll/${userEmail}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setMessages(response.data);
      }).catch((err) => {
        notifyError(err.response.data.message);
      });
  };

  const handleMessageEdit = (messageId) => {
    axios.put(
      `http://localhost:5005/messages/${messageId}`,
      { ...messageBody },
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then(() => {
        getAllMessages();
      }).catch((err) => {
        notifyError(err.response.data.message);
      });
  };

  return (
    <div className="message">
      <div className="message-title">
        {edit
          ? (
            <input
              type="text"
              name="title"
              placeholder={title}
              defaultValue={title}
              onChange={(e) => [handleMessageBodyChange(e)]}
            />
          )
          : (<h3>{title}</h3>)}
        <div className="message-icons">
          {edit
            ? (
              <button type="button" onClick={() => [setEdit(false), handleMessageEdit(id)]}>
                <FaRegSave className="edit-icon" size={25} />
              </button>
            )
            : (
              <button type="button" onClick={() => setEdit(true)}>
                <FiEdit2 className="edit-icon" size={25} />
              </button>
            )}
          <button type="button">
            <RiDeleteBin6Line className="delete-icon" size={25} onClick={() => handleDelete(id)} />
          </button>
        </div>
      </div>
      <div className="message-author">
        <span>{author}</span>
      </div>
      <div className="message-content">
        {edit
          ? (
            <input
              type="text"
              name="content"
              placeholder={content}
              defaultValue={content}
              onChange={(e) => [handleMessageBodyChange(e)]}
            />
          )
          : (<p>{content}</p>)}
      </div>
    </div>
  );
}

SingleMessage.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired,
};
