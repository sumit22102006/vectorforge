import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String, // Can be objectId if fully integrated with auth, but we use 'me' for now
      required: true,
      default: 'me'
    },
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: '👤'
    },
    group: {
      type: String,
      enum: ['Friends', 'Family', 'Teachers', 'Office', 'Other'],
      default: 'Other'
    },
    status: {
      type: String,
      default: 'offline' // 'online', 'typing', etc.
    },
    lastSeen: {
      type: String,
      default: 'Offline'
    }
  },
  {
    timestamps: true
  }
);

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
