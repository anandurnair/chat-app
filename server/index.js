const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Server-side Socket.IO setup
let onlineUsers = {};  // Track online users

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('online', (userId) => {
    userId = String(userId); 
    console.log('User online:', typeof userId);
    onlineUsers[userId] = socket.id;
    io.emit('update-status', { userId, status: 'online' });
    console.log('Online Users:', onlineUsers);
  });

  socket.on('offline', (userId) => {
    userId = String(userId); 
    delete onlineUsers[userId];
    io.emit('update-status', { userId, status: 'offline' });
    console.log('Online Users:', onlineUsers);
  });

  socket.on('send-message', ({ chatId, message }) => {
    chatId = String(chatId); 
    console.log(`Message received in chat ${chatId}:`, message);
    io.emit('receive-message', message); // Ensure messages are sent to the correct chat room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Sync database and start server
sequelize.sync().then(() => {
  server.listen(5000, () => console.log('Server running on port 5000'));
});
