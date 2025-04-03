import express from 'express';
import { getTopics, createTopic, updateTopic, deleteTopic } from '../../controllers/Subject/TopicController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all topics for a subject
router.get('/subject/:subjectId', getTopics);

// Create a new topic
router.post('/', createTopic);

// Update a topic
router.put('/:topicId', updateTopic);

// Delete a topic
router.delete('/:topicId', deleteTopic);

export default router; 