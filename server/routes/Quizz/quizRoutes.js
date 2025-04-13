import express from 'express';
import { getQuizStats, getTeacherQuizzes, getQuizDetails,getQuizList,startQuiz,userSubmitQuiz } from '../../controllers/Quizz/quizController.js';
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






//quiz start routes 
// router.post('/startquiz/:quizId', startQuiz);
// router.post('/submitquiz/:quizId', submitQuiz);
// router.post('/submitquiz/:quizId', submitQuiz);
// router get quiz list for the students of section and ddept and the and for today 

router.get('/quizlist/section/', getQuizList);
router.patch('/startquiz/:quizId', startQuiz);
router.post('/submitQuiz', userSubmitQuiz);
// http://localhost:5000/api/quizzes/submit-quiz



// /api/quizzes 










export default router; 