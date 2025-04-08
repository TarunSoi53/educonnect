import express from 'express';
import { getQuizStats, getTeacherQuizzes, getQuizDetails } from '../../controllers/Quizz/quizController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get quiz stats for a teacher
router.get('/stats/:teacherId', getQuizStats);

// Get all quizzes for a teacher with optional filters
router.get('/teacher/', getTeacherQuizzes);
// router.get('/startquiz/:quizId',startQuiz)

// Get quiz details with questions
router.get('/:quizId', getQuizDetails);

export default router; 