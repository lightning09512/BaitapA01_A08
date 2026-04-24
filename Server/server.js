require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const { connectDB, sequelize } = require('./config/database');
const apiRoutes = require('./routes/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Kết nối database
connectDB();

// Lắng nghe routes API
app.use('/', apiRoutes);

// --- SOCKET.IO NOTIFICATION LOGIC ---
const userSockets = new Map();

io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('register', (userId) => {
        userSockets.set(userId.toString(), socket.id);
        console.log(`[Socket] User ${userId} registered to socket ${socket.id}`);
    });

    socket.on('send_message', async ({ senderId, receiverId, content }) => {
        try {
            const { sendMessageInternal } = require('./controllers/chatController');
            const savedMsg = await sendMessageInternal(senderId, receiverId, content);
            
            // Emit to recipient if online
            const recipientSocketId = userSockets.get(receiverId.toString());
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive_message', savedMsg);
            }
            
            // Emit confirmation back to sender
            socket.emit('message_sent', savedMsg);
        } catch (error) {
            console.error('[Socket] Messaging error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
        for (let [uid, sid] of userSockets.entries()) {
            if (sid === socket.id) {
                userSockets.delete(uid);
                break;
            }
        }
    });
});

// alter: true giúp thêm cột mới (ví dụ: role) mà không xoá dữ liệu cũ
sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`[INFO] Server đang chạy trên cổng ${PORT}`);
    });
}).catch(err => {
    console.error("[ERROR] Không thể đồng bộ Database:", err);
});
