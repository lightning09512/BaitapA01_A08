import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from './api';

// Base URL usually same as API base but with socket protocol
const SOCKET_URL = api.defaults.baseURL;

let socket = null;

export const initiateSocket = async (userId) => {
    if (socket) return socket;

    socket = io(SOCKET_URL, {
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('[Socket] Connected');
        if (userId) {
            socket.emit('register', userId);
        }
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
