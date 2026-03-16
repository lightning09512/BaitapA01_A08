import { io } from 'socket.io-client';
import api from './api';

const SOCKET_URL = 'http://10.0.2.2:3000'; // Make sure this matches your backend URL
let socket = null;

export const initSocket = (username) => {
    if (socket) return socket;

    socket = io(SOCKET_URL);

    socket.on('connect', () => {
        console.log('[Socket] Connected to server, id:', socket.id);
        // Register the username with the socket to receive targeted notifications
        socket.emit('register', username);
    });

    socket.on('disconnect', () => {
        console.log('[Socket] Disconnected from server');
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
