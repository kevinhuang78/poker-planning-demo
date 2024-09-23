import { useState, useEffect } from "react";

import Chat from "./components/chat/chat";
import CardsList from "./components/card/cards-list";
import UsersList from "./components/users/users-list";

import './app.css';

// https://stackoverflow.com/a/44078785
const guid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const CLIENT_ID = guid();
const DEFAULT_USERNAME = `user-${guid()}`;
const URL = `wss://${import.meta.env.VITE_WS_URL}?client_id=${CLIENT_ID}&default_username=${DEFAULT_USERNAME}`;

export type CardValue = number | '?' | 'pass' | '...';
export type User = { clientId: string; username?: string; defaultUsername: string; cardValue?: CardValue; }
export type Info = { type: 'info'; data: { allUsers: User[] } };
export type Message = { type: 'message'; username: string; message: string; clientId: string; };
export type CardEvent = { type: 'card'; clientId: string; username: string; value: CardValue; };
export type CardFlippedEvent = { type: 'card_info'; areCardsFlipped: boolean; };
type WebSocketData = Message | CardEvent | Info | CardFlippedEvent;

const App = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState(new WebSocket(URL));
  const [selectedCard, setSelectedCard] = useState<CardEvent['value']>();
  const [shouldCardsBeFlipped, setShouldCardsBeFlipped] = useState(false);

  const getData = () => {
    ws.send(JSON.stringify({ type: 'get_data' } ));
  };

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

  const onHideCards = () => {
    const dataSent: WebSocketData = { type: 'card_info', areCardsFlipped: false };
    setSelectedCard(undefined);
    ws.send(JSON.stringify(dataSent));
    submitMessage({ username, message: "I'm hiding the cards!" });
  };
  const onShowCards = () => {
    const dataSent: WebSocketData = { type: 'card_info', areCardsFlipped: true };
    ws.send(JSON.stringify(dataSent));
    submitMessage({ username, message: "I'm showing the cards!" });
  };

  useEffect(() => {
    ws.onopen = () => {
      submitMessage({ username, message: 'I just logged in!' })
      getData();
    }

    ws.onmessage = (e) => {
      const data: WebSocketData = JSON.parse(e.data);
      if (data.type === 'message') {
        if (data.message === 'I just logged in!' || data.message === 'I disconnected!') getData();
        setMessages([data, ...messages]);
      }
      if (data.type === 'info') {
        if (!!data.data.allUsers && JSON.stringify(data.data.allUsers) !== JSON.stringify(allUsers))
          setAllUsers(data.data.allUsers);
      }
      if (data.type === 'card_info') {
        const newStateCardsFlipped = data.areCardsFlipped;
        if (newStateCardsFlipped === false) setSelectedCard(undefined);
        setShouldCardsBeFlipped(newStateCardsFlipped);
      }
    }

    ws.onerror = (e) => {
      console.error('Error connecting with Websocket', e);
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
      <UsersList selfClientId={CLIENT_ID} allUsers={allUsers} shouldCardsBeFlipped={shouldCardsBeFlipped} />
      <div className="container">
        <a href="#" className="button button--pen">
          <div className="button__wrapper" onClick={shouldCardsBeFlipped ? onHideCards : onShowCards}>
            <span className="button__text">{shouldCardsBeFlipped ? 'HIDE' : 'SHOW'}</span>
          </div>
          <div className="characterBox">
            <div className="character wakeup">
              <div className="character__face"></div>
              <div className="charactor__face2"></div>
            </div>
            <div className="character wakeup">
              <div className="character__face"></div>
              <div className="charactor__face2"></div>
            </div>
            <div className="character">
              <div className="character__face"></div>
              <div className="charactor__face2"></div>
            </div>
          </div>
        </a>
      </div>
      <CardsList setSelectedCard={setCard} selectedCard={selectedCard} shouldCardsBeFlipped={shouldCardsBeFlipped} />
    </div>
  )
}

export default App;
