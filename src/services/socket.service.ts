// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import { Notification } from './types';

// The URL of your backend server
const SERVER_URL = 'http://localhost:3001'; // <-- IMPORTANT: Change this to your server's address

let socket: Socket;

const connect = (token: string) => {
  // Prevent multiple connections
  if (socket?.connected) {
    return;
  }

  // Connect to the server, sending the Firebase token for authentication
  // The backend will use this token to associate the socket with a userId
  socket = io(SERVER_URL, {
    auth: {
      token: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
};

const disconnect = () => {
  if (socket) {
    socket.disconnect();
  }
};

/**
 * Listens for incoming notification events from the server.
 * @param onNotificationReceived - A callback function to be executed when a notification arrives.
 */
const onNotification = (onNotificationReceived: (notification: Notification) => void) => {
  if (socket) {
    // The event name 'notification' must match what the server emits
    socket.on('notification', onNotificationReceived);
  }
};

/**
 * Stop listening for notification events.
 */
const offNotification = () => {
  if (socket) {
    socket.off('notification');
  }
};


export const socketService = {
  connect,
  disconnect,
  onNotification,
  offNotification
};