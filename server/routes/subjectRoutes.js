import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
  addSubject,
  getTeacherSubjects,
  getSubjectsByDepartmentAndSection
} from '../controllers/subjectController.js';

const router = express.Router();

// Add a new subject (teacher only)
router.post('/',
  authMiddleware,
  roleMiddleware('teacher'),
  addSubject
);

// Get all subjects for a teacher
router.get('/teacher',
  authMiddleware,
  roleMiddleware('teacher'),
  getTeacherSubjects
);

// Get subjects by department and section
router.get('/department/:departmentId/section/:sectionId',
  authMiddleware,
  getSubjectsByDepartmentAndSection
);

export default router; 