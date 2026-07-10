import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // If it's sent by a persona/LLM or to a persona, we might use a string ID (like 'alex')
      // For real-time one-to-one, it refers to real users. We'll allow strings to keep it flexible for personas.
      type: String,
      required: true
    },
    receiver: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent'
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
