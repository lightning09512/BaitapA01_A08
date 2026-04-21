import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from './api';

// Base URL usually same as API base but with socket protocol
const SOCKET_URL = api.defaults.baseURL;

let socket = null;

export const initiateSocket = async (userId) => {
    if (socket) {
        if (socket.connected && userId) {
            socket.emit('register', userId);
        } else if (!socket.connected) {
            socket.connect();
        }
        return socket;
    }

    socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
    });

    socket.on('connect', () => {
        console.log('[Socket] Connected with ID:', socket.id);
        if (userId) {
            socket.emit('register', userId);
        }
    });

    socket.on('connect_error', (error) => {
        console.error('[Socket] Connection Error:', error.message);
    });

    socket.on('error', (error) => {
        console.error('[Socket] General Error:', error);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
