import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Context } from '../../context/loginContext';
import SingleMessage from './SingleMessage/SingleMessage';

import './style.css';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const { userEmail, token } = useContext(Context);
  const [createMess, setCreateMess] = useState(false);

  const notifyError = (message) => toast.error(message);

  const [messageBody, setMessageBody] = useState({
    title: '',
    content: '',
  });

  const getAllMessages = () => {
    axios.get(`http://localhost:5005/messages/getAll/${userEmail}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setMessages(response.data);
      }).catch((err) => {
        notifyError(err.response.data.message);
      });
  };

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

  const handleMessageBodySubmit = () => {
    axios.post(
      'http://localhost:5005/messages/',
      { ...messageBody, userEmail },
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then(() => {
        getAllMessages();
      });
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  const handleDelete = (messageId) => {
    axios.delete(`http://localhost:5005/messages/${messageId}`, { headers: { Authorization: `Bearer ${token}` } }).then(() => {
      messages.forEach((e, index) => {
        if (e.id === messageId) {
          const newMessages = [...messages];
          newMessages.splice(index, 1);
          setMessages(newMessages);
        }
      });
    }).catch((err) => {
      notifyError(err.response.data.message);
    });
  };

  return (
    <div className="container">
      <div className="wrap-container">
        <div className="superior-part">
          <h1>
            Mensagens
          </h1>
          <button type="button" onClick={() => setCreateMess((m) => !m)}>
            <AiOutlinePlus size={35} />
          </button>
        </div>
        {createMess
          ? (
            <div className="add-container">
              <div className="input-container">
                <input
                  className="add-input"
                  placeholder="Título"
                  name="title"
                  onChange={handleMessageBodyChange}
                />
                <textarea
                  rows="4"
                  cols="50"
                  className="add-input2"
                  placeholder="Mensagem"
                  name="message"
                  onChange={handleMessageBodyChange}
                />
              </div>
              <button
                className="add-button"
                type="button"
                onClick={(e) => [setCreateMess((m) => !m), handleMessageBodySubmit(e)]}
              >
                Salvar
              </button>
            </div>
          )
          : null}
        <div className="content">
          {messages.map((mes) => (
            <SingleMessage
              author={mes.userEmail}
              content={mes.content}
              title={mes.title}
              key={mes.id}
              id={mes.id}
              handleDelete={handleDelete}
              setMessages={setMessages}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
