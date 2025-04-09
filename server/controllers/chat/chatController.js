import ChatGroup from '../../models/ChatGroup/ChatGroupModel.js';
import Message from '../../models/ChatGroup/messageModel.js';
import Subject from '../../models/Subject/SubjectModel.js';

// Get all chat groups for a user
export const getUserChatGroups = async (req, res) => {
  try {
    const chatGroups = await ChatGroup.find({
      members: req.user.id
    })
    .populate('subjectId', 'name code')
    .sort({ createdAt: -1 });
    
    res.json(chatGroups);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a specific chat group
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log("fetching messages fromt the group id ",groupId)
    
    // Check if user is a member of this group
    const chatGroup = await ChatGroup.findOne({
      _id: groupId,
      members: req.user.id
    });
    console.log("Chat group found here in fetching messagess:", chatGroup);
    
    if (!chatGroup) {
      return res.status(403).json({ message: 'Not authorized to access this group' });
    }
    
    // Get messages
    const messages = await Message.find({ chatGroupId: groupId })
    .populate("senderId", "name")
    .sort({ createdAt: 1 })
    .lean() // Use .lean() to get plain JavaScript objects
    const messagesWithOwnership = messages.map((message) => ({
      ...message,
      isSentByMe: message.senderId._id.toString() === req.user.id,
    }));
    console.log("Messages found in the group :", messages);
    
    res.json(messagesWithOwnership);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message to a chat group
export const sendMessage = async (req, res) => {
  try {
    const { groupId, content } = req.body;
    
    // Check if user is a member of this group
    const chatGroup = await ChatGroup.findOne({
      _id: groupId,
      members: req.user.id
    });
    
    if (!chatGroup) {
      return res.status(403).json({ message: 'Not authorized to access this group' });
    }
    console.log("req.user model for  fixing the issue",req.role)
    let role;
     if (req.role == 'student') {
      role='Student';
      }
      else if (req.role == 'teacher') {
        role='Teacher';
      }
      else{
        role=null
      }
      console.log("role to the message",role)

     
    
    // Create and save message
    const message = new Message({
      chatGroupId: groupId,
      senderId: req.user.id,
      senderRole:role,
      content
    });
    console.log("Message created:", message);
    
    await message.save();
    console.log("Message  new created:", message);
 
    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name');
     
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};