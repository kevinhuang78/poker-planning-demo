import { useState, useEffect } from "react";

import Chat from "./components/chat/chat";
import CardsList from "./components/card/cards-list";
import UsersList from "./components/users/users-list";

// https://stackoverflow.com/a/44078785
const guid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const CLIENT_ID = guid();
const DEFAULT_USERNAME = `user-${guid()}`;
const URL = `ws://127.0.0.1:8080?client_id=${CLIENT_ID}&default_username=${DEFAULT_USERNAME}`;

export type User = { clientId: string; username?: string; defaultUsername: string; }
export type Info = { type: 'info'; data: { allUsers: User[] } };
export type Message = { type: 'message'; username: string; message: string; clientId: string; };
export type CardEvent = { type: 'card'; clientId: string; username: string; value: number | '?' | 'pass'; };
type WebSocketData = Message | CardEvent | Info;

const App = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState(new WebSocket(URL));
  const [selectedCard, setSelectedCard] = useState<CardEvent['value']>();
  const [lastCardEvent, setLastCardEvent] = useState<CardEvent>();

  const submitMessage = (message: Pick<Message, 'username' | 'message'>) => {
    const sentMessage: Message = {...message, clientId: CLIENT_ID, type: 'message'};
    ws.send(JSON.stringify(sentMessage));
    setMessages([sentMessage, ...messages]);
  }

  const onClose = () => {
    ws.send(JSON.stringify({ type: 'info', data: { disconnectedUser: CLIENT_ID } }));
    submitMessage({ username, message: 'I disconnected!' });
  };

  const setCard = (cardValue: CardEvent['value']) => {
    setSelectedCard(cardValue)
    ws.send(JSON.stringify({ type: 'card', clientId: CLIENT_ID, username, value: cardValue } ));
  };

  useEffect(() => {
    ws.onopen = () => {
      submitMessage({ username, message: 'I just logged in!' })
    }

    ws.onmessage = (e) => {
      const data: WebSocketData = JSON.parse(e.data);
      console.log(data, 'data');
      if (data.type === 'message') setMessages([data, ...messages]);
      if (data.type === 'info') {
        if (!!data.data.allUsers && JSON.stringify(data.data.allUsers) !== JSON.stringify(allUsers))
          setAllUsers(data.data.allUsers);
      }
      if (data.type === 'card') {
        setLastCardEvent(data);
      }
    }

    return () => {
      ws.onclose = () => {
        onClose();
        setWs(new WebSocket(URL));
      }
    }
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      onClose();
    });
  }, []);

  return (
    <div>
      <Chat messages={messages} submitMessage={submitMessage} username={username} setUsername={setUsername} clientID={CLIENT_ID} />
      <UsersList selfClientId={CLIENT_ID} allUsers={allUsers} lastCardEvent={lastCardEvent} selfSelectedCard={selectedCard} />
      <CardsList setSelectedCard={setCard} selectedCard={selectedCard} />
    </div>
  )
}

export default App;
