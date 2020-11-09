import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ISocketMessage } from '../interfaces/Socket.interface';
import store from '../store';
const wsAddress = process.env.REACT_APP_WS_ADDRESS || 'ws://localhost:8080';
const useConnector = () => {
  const [activeSocket, setSocket] = useState<SocketIOClient.Socket>();
  const [error, setError] = useState<boolean>(false);

  const maxAttempts = 4;

  useEffect(() => {
    let tryCount = 0;
    if (activeSocket) {
      return;
    }
    const socket = io(wsAddress, {
      autoConnect: true,
      reconnectionAttempts: maxAttempts,
    });

    function connect() {
      socket.connect();
    }

    socket.on('connect', () => {
      setSocket(socket);
      setError(false);
    });

    socket.on('disconnect', () => {
      connect();
    });

    socket.on('message', (message: ISocketMessage) => {
      console.log(`[${message.type}] ${JSON.stringify(message.data)}`);
      switch (message.type) {
        case 'jobState':
          console.log('updated', message);
          store.job = { ...message.data };
          break;

        default:
          break;
      }
    });

    socket.on('connect_error', () => {
      tryCount++;
      if (tryCount === maxAttempts) {
        setError(true);
      }
      console.error('Connection error');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit(type: string, data: any) {
    if (activeSocket) {
      activeSocket.emit('message', {
        type,
        data,
      });
    }
  }

  return { socket: activeSocket, emit, error };
};

export default useConnector;
