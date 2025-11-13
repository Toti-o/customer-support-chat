import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", "https://customersupportchat.netlify.app",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed'));
    }
  }
});

// In-memory storage (in production, use a database)
const users = new Map();
const messages = [];
const supportAgents = new Map();

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/uploads/${req.file.filename}`
  });
});

// Error handling for file upload
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(400).json({ error: error.message });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins the chat
  socket.on('user_join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      email: userData.email,
      type: userData.type || 'customer',
      isOnline: true,
      joinedAt: new Date()
    };
    
    users.set(socket.id, user);
    
    // Notify everyone about online users
    io.emit('users_online', Array.from(users.values()).filter(u => u.isOnline));
    
    // Send chat history to the new user
    socket.emit('chat_history', messages);
    
    // Notify that a user has joined
    if (user.type === 'customer') {
      io.emit('user_joined', {
        username: user.username,
        message: `${user.username} has joined the chat`,
        timestamp: new Date()
      });
    }
    
    console.log(`User ${user.username} joined as ${user.type}`);
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.broadcast.emit('user_typing', {
      username: data.username,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    socket.broadcast.emit('user_typing', {
      username: data.username,
      isTyping: false
    });
  });

  // Handle new messages
  socket.on('send_message', (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    const message = {
      id: uuidv4(),
      username: user.username,
      userId: socket.id,
      message: data.message,
      timestamp: new Date(),
      type: 'text',
      readBy: [socket.id]
    };
    
    messages.push(message);
    io.emit('new_message', message);
    console.log(`Message from ${user.username}: ${data.message}`);
  });

  // Handle file messages
  socket.on('send_file', (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    const message = {
      id: uuidv4(),
      username: user.username,
      userId: socket.id,
      file: data.file,
      fileName: data.fileName,
      fileSize: data.fileSize,
      timestamp: new Date(),
      type: 'file',
      readBy: [socket.id]
    };
    
    messages.push(message);
    io.emit('new_message', message);
    console.log(`File sent from ${user.username}: ${data.fileName}`);
  });

  // Mark message as read
  socket.on('mark_read', (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message && !message.readBy.includes(socket.id)) {
      message.readBy.push(socket.id);
      io.emit('message_read', { messageId, readBy: message.readBy });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      
      io.emit('user_left', {
        username: user.username,
        message: `${user.username} has left the chat`,
        timestamp: new Date()
      });
      
      io.emit('users_online', Array.from(users.values()).filter(u => u.isOnline));
      
      console.log(`User ${user.username} disconnected`);
    }
    
    users.delete(socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
