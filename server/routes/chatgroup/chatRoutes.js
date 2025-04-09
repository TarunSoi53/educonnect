import express from 'express';
import {getUserChatGroups,getGroupMessages ,sendMessage} from '../../controllers/chat/chatController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();
// Get user's chat groups
router.get(
  '/groups',
  authMiddleware,
  getUserChatGroups
);

// Get messages for a chat group
router.get(
  '/groups/:groupId/messages',
  authMiddleware,
 getGroupMessages
);

// Send a message to a chat group
router.post(
  '/messages',
  authMiddleware,
 sendMessage
);

export default router;