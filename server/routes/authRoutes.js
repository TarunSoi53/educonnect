import express from 'express';
import {
    registerCollegeAdmin,
    registerTeacher,
    registerStudent,
    login,
    verify
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration routes
router.post('/register/admin', registerCollegeAdmin);
router.post('/register/teacher', registerTeacher);
router.post('/register/student', registerStudent);

// Login route (for all roles)
router.post('/login', login);
router.get('/verify',authMiddleware,verify)

export default router; 