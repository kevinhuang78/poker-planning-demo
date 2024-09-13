import {useState} from "react";

import type {Message} from '../../App';

import './chat.css';

type ChatProps = {
  messages: Message[];
  submitMessage: (message: Pick<Message, 'username' | 'message'>) => void;
  username: Message['username'];
  setUsername: (user: Message['username']) => void;
  clientID: string;
};

const Chat = ({ messages, submitMessage, username, setUsername, clientID }: ChatProps) => {
  const [message, setMessage] = useState<string>('');

  return (
    <div className='chat'>
      <div className='chat-box'>
        <div className='chat-header'>
          <div className='chat-header-bubbles'>
            <div className='chat-header-bubble' />
            <div className='chat-header-bubble' />
            <div className='chat-header-bubble' />
          </div>
          <span>Chat box</span>
          <div className='chat-header-right-space' />
        </div>
        <label htmlFor="user" className='chat-username'>
          Username
          <input
            type="text"
            id="user"
            placeholder="User name"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>

        <div className='chat-list'>
          <ul>
            {messages.reverse().map((message, index) =>
              <li key={index} className={message.clientId === clientID ? 'recipient' : 'sender'}>
                <b>{message.username}</b>: <em>{message.message}</em>
              </li>
            )}
          </ul>
        </div>

        <form
          className='chat-input-form'
          onSubmit={e => {
            e.preventDefault();
            submitMessage({ username, message });
            setMessage('');
          }}
        >
          <input
            type="text"
            placeholder='Type a message ...'
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <input type="submit" value='Send' />
        </form>
      </div>
    </div>
  );
};

export default Chat;
