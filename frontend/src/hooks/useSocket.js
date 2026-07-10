import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setSocket(socketRef.current);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      // Join the socket room with user's ID
      socketRef.current.emit('join', userId);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  return { socket, isConnected };
};
