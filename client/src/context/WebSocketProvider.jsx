import { useContext, useState, useMemo, useRef, useEffect, createContext } from 'react';
import { io } from 'socket.io-client';

export const WebsocketContext = createContext(false, null, () => {});

export const WebsocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  const ws = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('error', (err) => {
      console.log(`Error: ${err.message}`);
    });

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const values = useMemo(() => {
    return {
      connected,
      socket: ws.current,
    };
  }, [connected]);

  return <WebsocketContext.Provider value={values}>{children}</WebsocketContext.Provider>;
};

export const useWebSocketContext = () => {
  const context = useContext(WebsocketContext);

  if (!context) {
    throw new Error('useWebSocketContext must be called inside the WebsocketProvider');
  }

  return context;
};
