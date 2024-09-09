import {useState} from "react";

import type {Message} from '../../App';

import './chat.css';

type ChatProps = {
  messages: Message[];
  submitMessage: (message: Message) => void;
  user: Message['user'];
  setUser: (user: Message['user']) => void;
};

const Chat = ({ messages, submitMessage, user, setUser }: ChatProps) => {
  const [message, setMessage] = useState<string>('');

  return (
    <div className='chat'>
      <label htmlFor="user">
        Name :
        <input
          type="text"
          id="user"
          placeholder="User"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
      </label>

      <div className='chat-list'>
        <ul>
          {messages.reverse().map((message, index) =>
            <li key={index}>
              <b>{message.user}</b>: <em>{message.message}</em>
            </li>
          )}
        </ul>
      </div>

      <form
        action="client/src/components"
        onSubmit={e => {
          e.preventDefault();
          submitMessage({ user, message });
          setMessage('');
        }}
      >
        <input
          type="text"
          placeholder={'Type a message ...'}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <input type="submit" value='Send' />
      </form>
    </div>
  );
};

export default Chat;
