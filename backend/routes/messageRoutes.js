import express from 'express';
import { getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get message history between two users (or persona)
// We will not require 'protect' for local dev unless requested, but let's keep it open for now or we can use protect if frontend is sending tokens.
// Since frontend isn't fully integrated with auth headers everywhere yet, we'll leave it open.
router.get('/messages/:user1/:user2', getMessages);

export default router;
