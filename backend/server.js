import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes.js';
import parserRoutes from './routes/parserRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import analyzerRoutes from './routes/analyzerRoutes.js';
import personalityRoutes from './routes/personalityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import promptRoutes from './routes/promptRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { initChatSocket } from './sockets/chatSocket.js';

// Load environment configuration parameters
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for development, restrict in production
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Initialize WebSockets
initChatSocket(io);

// Set up cross-origin sharing for communication with the React app
app.use(cors());

// Body parser filters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Binds core API routing endpoints
app.use('/api', uploadRoutes);
app.use('/api', parserRoutes);
app.use('/api', ownerRoutes);
app.use('/api', trainingRoutes);
app.use('/api', analyzerRoutes);
app.use('/api', personalityRoutes);
app.use('/api', chatRoutes);
app.use('/api', promptRoutes);
app.use('/api', authRoutes);
app.use('/api', messageRoutes);
app.use('/api', contactRoutes);

// Backend diagnostics endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Digital Clone AI Backend API' });
});

// Centralized error boundary middleware catching upload errors
app.use(errorHandler);

// Boot server listener
server.listen(PORT, () => {
  console.log(`[Server] Digital Clone AI Backend booted successfully on port ${PORT}`);
});
