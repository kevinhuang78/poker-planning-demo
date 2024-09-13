import {useState} from "react";

import type {Message} from '../../App';

import './chat.css';

type ChatProps = {
  messages: Message[];
  submitMessage: (message: Pick<Message, 'username' | 'message'>) => void;
  username: Message['username'];
  setUsername: (user: Message['username']) => void;
};

const Chat = ({ messages, submitMessage, username, setUsername }: ChatProps) => {
  const [message, setMessage] = useState<string>('');

  return (
    <div className='chat'>
      <label htmlFor="user">
        Name :
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
            <li key={index}>
              <b>{message.username}</b>: <em>{message.message}</em>
            </li>
          )}
        </ul>
      </div>

      <form
        action="client/src/components"
        onSubmit={e => {
          e.preventDefault();
          submitMessage({ username, message });
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
