


import { Server } from 'socket.io';
import  jwt from 'jsonwebtoken';
import  Message from './models/ChatGroup/messageModel.js';
import  ChatGroup from './models/ChatGroup/ChatGroupModel.js';
import Teacher from './models/UserModel/Teachers/teacherModel.js';
import  Student from './models/UserModel/Students/StudentModel.js';

export const setupSocket=(server)=> {
    const io = new Server(server, { // Use 'new Server()'
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });

  // Socket middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log("Socket token:", token);
      if (!token) {
        return next(new Error('Authentication error'));
      }
let user;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   const user = await User.findById(decoded.id).select('-password');
console.log("Decoded token in socket : ", decoded);

    user = await Teacher.findById(decoded.id).select('-password');
    if (!user) {
      // If not found in Teacher model, try Student model
     
      user = await Student.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }
    }
      

      socket.user = user;
      socket.user.role = decoded.role; // Store role in socket for later use
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    // Join user to their chat groups
    socket.on('joinGroups', async (groupIds) => {
      try {
        // Verify user is member of these groups
        const groups = await ChatGroup.find({
          _id: { $in: groupIds },
          members: socket.user._id
        });
        console.log("Groups found:", groups);

        const validGroupIds = groups.map(group => group._id.toString());
        
        // Join valid groups
        validGroupIds.forEach(groupId => {
            socket.join(groupId);
            console.log(`User ${socket.user.name} joined group ${groupId}`);
          });
  
          socket.emit('groupsJoined', validGroupIds);
        } catch (err) {
          console.error('Error joining groups:', err);
          socket.emit('error', { message: 'Failed to join groups' });
        }
      });
  
      // Handle sending message
      // socket.on('sendMessage', async (data) => {
      //   try {
      //     const { groupId, content } = data;
          
      //     // Check if user is member of the group
      //     const group = await ChatGroup.findOne({
      //       _id: groupId,
      //       members: socket.user._id
      //     });
          
      //     if (!group) {
      //       return socket.emit('error', { message: 'Not authorized to send message to this group' });
      //     }
          
      //     // Create and save message
      //     const message = new Message({
      //       chatGroupId: groupId,
      //       senderId: socket.user._id,
      //       content
      //     });
          
      //     await message.save();
          
      //     // Get populated message to send back
      //     const populatedMessage = await Message.findById(message._id)
      //       .populate('senderId', 'name role');
          
      //     // Broadcast to room
      //     io.to(groupId).emit('newMessage', populatedMessage);
      //   } catch (err) {
      //     console.error('Error sending message:', err);
      //     socket.emit('error', { message: 'Failed to send message' });
      //   }
      // });
    //   socket.on('sendMessage', async (data) => {
    //     try {
    //         const { groupId, content } = data;

    //         // Check if user is a member of the group (similar to controller)
    //         const chatGroup = await ChatGroup.findOne({
    //             _id: groupId,
    //             members: socket.user._id
    //         });

    //         if (!chatGroup) {
    //             return socket.emit('error', { message: 'Not authorized to send message to this group' });
    //         }

    //         // Determine user role (similar to controller)
    //         let senderRole;
    //         if (socket.user.role === 'student') {
    //             senderRole = 'Student';
    //         } else if (socket.user.role === 'teacher') {
    //             senderRole = 'Teacher';
    //         } else {
    //             senderRole = null;
    //         }
    //         console.log("role to the message", senderRole);

    //         // Create and save message (similar to controller)
    //         const message = new Message({
    //             chatGroupId: groupId,
    //             senderId: socket.user._id,
    //             senderRole: senderRole,
    //             content
    //         });
    //         console.log("Message created via Socket:", message);

    //         await message.save();
    //         console.log("Message new created via Socket:", message);

    //         // Populate sender info (similar to controller's population)
    //         const populatedMessage = await Message.findById(message._id)
    //             .populate('senderId', 'name role'); // Assuming 'role' is in your user models

    //         // Broadcast to room
    //         io.to(groupId).emit('newMessage', populatedMessage);

    //     } catch (err) {
    //         console.error('Error sending message via Socket:', err);
    //         socket.emit('error', { message: 'Failed to send message' });
    //     }
    // });
    socket.on('sendMessage', async (data) => {
      const { groupId, content } = data;
      console.log(`[SOCKET] Received sendMessage event from user ${socket.user._id} (${socket.user.name})`);
      console.log(`[SOCKET]   groupId: ${groupId}`);
      console.log(`[SOCKET]   content: ${content}`);
  
      try {
          // Check if user is a member of the group
          console.log(`[SOCKET] Querying ChatGroup for groupId: ${groupId} and member: ${socket.user._id}`);
          const chatGroup = await ChatGroup.findOne({
              _id: groupId,
              members: socket.user._id
          });
          console.log(`[SOCKET] ChatGroup found:`, chatGroup);
  
          if (!chatGroup) {
              console.log(`[SOCKET] Error: User ${socket.user._id} is not a member of group ${groupId}`);
              return socket.emit('error', { message: 'Not authorized to send message to this group' });
          }
  
          // Determine user role
          let senderRole = null;
          if (socket.user.role === 'student') {
              senderRole = 'Student';
          } else if (socket.user.role == 'teacher') {
              senderRole = 'Teacher';
          }
          console.log(`[SOCKET] Sender Role: ${senderRole}`);
  
          // Create and save message
          const message = new Message({
              chatGroupId: groupId,
              senderId: socket.user._id,
              senderRole: senderRole,
              content
          });
          console.log(`[SOCKET] Creating new Message:`, message);
  
          console.log(`[SOCKET] Saving Message to database...`);
          await message.save();
          console.log(`[SOCKET] Message saved successfully:`, message);
  
          // Populate sender info
          console.log(`[SOCKET] Populating sender info for message ID: ${message._id}`);
          const populatedMessage = await Message.findById(message._id)
              .populate('senderId', 'name role');
          console.log(`[SOCKET] Populated Message:`, populatedMessage);
          
          // Broadcast to room
          console.log(`[SOCKET] Emitting newMessage to group: ${groupId}`);
         
          
          console.log(`[SOCKET] final Message:`,populatedMessage);
          io.to(groupId).emit('newMessage', populatedMessage);
  
      } catch (err) {
          console.error('[SOCKET] Error sending message via Socket:', err);
          socket.emit('error', { message: 'Failed to send message' });
      }
  });
  
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.name} (${socket.user._id})`);
      });
    });
  
    return io;
  };
