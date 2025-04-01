import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
    addDepartment,
    getDepartments,
    getDepartmentsList,
    getDepartmentsListByCollegeId,
    updateDepartment,
    deleteDepartment,
    
    assignDepartmentHead,
    addTeacherToDepartment,
    removeTeacherFromDepartment
} from '../controllers/departmentController.js';
import {addSection,
    getSections,
    updateSection,
    deleteSection} from '../controllers/sectionController.js';

const router = express.Router();

// Department routes
router.post('/addDepartment',
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    addDepartment
);

router.get('/',authMiddleware, getDepartmentsList);
router.get('/:collegeId/', getDepartmentsListByCollegeId);

router.get('/:id', getDepartments);

router.put('/:id', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    updateDepartment
);

router.delete('/:id', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    deleteDepartment
);

// Department head assignment
router.post('/:id/head', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    assignDepartmentHead
);

// Teacher management
router.post('/:id/teachers', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    addTeacherToDepartment
);

router.delete('/:id/teachers/:teacherId', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    removeTeacherFromDepartment
);

// Section routes


export default router; 