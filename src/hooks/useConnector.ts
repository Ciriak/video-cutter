import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ISocketMessage } from '../interfaces/Socket.interface';
import store from '../store';
const wsAddress = process.env.REACT_APP_WS_ADDRESS || 'ws://localhost:8080';
const useConnector = () => {
  const [activeSocket, setSocket] = useState<SocketIOClient.Socket>();
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    if (activeSocket) {
      return;
    }
    const socket = io(wsAddress);

    socket.on('connect', () => {
      setSocket(socket);
      setError(false);
    });

    socket.on('disconnect', () => {
      socket.connect();
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
      setError(true);
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
