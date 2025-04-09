import mongoose from "../../config/index.js";

const ChatGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    unique: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatGroup = mongoose.model('ChatGroup', ChatGroupSchema);
export default ChatGroup;