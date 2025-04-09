import mongoose from "../../config/index.js";

const MessageSchema = new mongoose.Schema({
  chatGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatGroup',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderRole',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['Teacher', 'Student'],

  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries by chat group
MessageSchema.index({ chatGroupId: 1, createdAt: 1 });

const Message = mongoose.model('Message', MessageSchema);
export default Message;