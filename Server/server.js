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
        userSockets.set(userId, socket.id);
        console.log(`[Socket] User ${userId} registered to socket ${socket.id}`);
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

// Chạy server
sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Không thể đồng bộ Database:", err);
});
