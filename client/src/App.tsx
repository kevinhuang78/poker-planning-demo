import { useState, useEffect } from "react";

import './app.css';

const URL = 'ws://127.0.0.1:8080';

type Message = { user: string; message: string; };

const App = () => {
  const [user, setUser] = useState('Tarzan');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState(new WebSocket(URL));

  const submitMessage = (message: Message) => {
    ws.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  }

  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Connected');
    }

    ws.onmessage = async (e) => {
      const data = await e.data.text();
      const message: Message = JSON.parse(data);
      setMessages([message, ...messages]);
    }

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWs(new WebSocket(URL));
      }
    }
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

  return (
    <div>
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

      <ul>
        {messages.reverse().map((message, index) =>
          <li key={index}>
            <b>{message.user}</b>: <em>{message.message}</em>
          </li>
        )}
      </ul>

      <form
        action=""
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
        <input type="submit" value={'Send'} />
      </form>
    </div>
  )
}

export default App;
