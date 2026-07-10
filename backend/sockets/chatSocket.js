import Message from '../models/Message.js';

const onlineUsers = new Map(); // Map userId -> socketId

export const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] New connection: ${socket.id}`);

    // User joins with their ID
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`[Socket] User ${userId} joined with socket ${socket.id}`);
      
      // Broadcast to all that this user is online
      io.emit('userOnline', { userId, status: 'online' });
    });

    // Handle sending a message
    socket.on('sendMessage', async (data) => {
      const { sender, receiver, text } = data;
      
      try {
        // Save to DB
        const message = await Message.create({ sender, receiver, text, status: 'sent' });

        const receiverSocketId = onlineUsers.get(receiver);
        if (receiverSocketId) {
          // Deliver to receiver instantly
          io.to(receiverSocketId).emit('receiveMessage', message);
          
          // Optionally auto-update status to delivered since they are online
          message.status = 'delivered';
          await message.save();
          
          // Notify sender it was delivered
          socket.emit('messageStatus', { messageId: message._id, status: 'delivered' });
        }
      } catch (err) {
        console.error('[Socket] Error saving message:', err.message);
      }
    });

    // Handle typing status
    socket.on('typing', ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', { sender, isTyping: true });
      }
    });

    socket.on('stopTyping', ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', { sender, isTyping: false });
      }
    });

    // Handle read receipts
    socket.on('markSeen', async ({ messageId, sender, receiver }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { status: 'seen' });
        
        const senderSocketId = onlineUsers.get(sender); // the person who sent the message
        if (senderSocketId) {
          io.to(senderSocketId).emit('messageSeen', { messageId });
        }
      } catch (err) {
        console.error('[Socket] Error marking seen:', err.message);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }
      
      if (disconnectedUserId) {
        console.log(`[Socket] User ${disconnectedUserId} disconnected`);
        io.emit('userOnline', { userId: disconnectedUserId, status: 'offline' });
      }
    });
  });
};
