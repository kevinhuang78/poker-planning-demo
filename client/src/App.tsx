import { useState, useEffect } from "react";

import Chat from "./components/chat/chat";

const URL = 'ws://127.0.0.1:8080';


// https://stackoverflow.com/a/44078785
const guid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export type Message = { user: string; message: string; };

const App = () => {
  const [user, setUser] = useState(guid());
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState(new WebSocket(URL));

  const submitMessage = (message: Message) => {
    ws.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  }

  useEffect(() => {
    ws.onopen = () => {
      submitMessage({ user, message: 'I just logged in!' })
    }

    ws.onmessage = async (e) => {
      const data = await e.data.text();
      const message: Message = JSON.parse(data);
      setMessages([message, ...messages]);
    }

    return () => {
      ws.onclose = () => {
        submitMessage({ user, message: 'I disconnected!' })
        setWs(new WebSocket(URL));
      }
    }
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

  return (
    <div>
      <Chat messages={messages} submitMessage={submitMessage} user={user} setUser={setUser} />
    </div>
  )
}

export default App;
