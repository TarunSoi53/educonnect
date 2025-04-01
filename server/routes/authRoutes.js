import express from 'express';
import {
    registerCollegeAdmin,
    registerTeacher,
    registerStudent,
    login
} from '../controllers/authController.js';

const router = express.Router();

// Registration routes
router.post('/register/admin', registerCollegeAdmin);
router.post('/register/teacher', registerTeacher);
router.post('/register/student', registerStudent);

// Login route (for all roles)
router.post('/login', login);

export default router; 