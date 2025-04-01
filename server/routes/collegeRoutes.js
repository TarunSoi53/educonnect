import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
    createCollege,
    getColleges,
    getCollegeById,
    updateCollege,
    deleteCollege
} from '../controllers/collegeController.js';

const router = express.Router();

// Create new college (protected, college admin only)
router.post('/', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    createCollege
);

// Get all colleges (public)
router.get('/', getColleges);

// Get college by ID (public)
router.get('/:id', getCollegeById);

// Update college (protected, college admin only)
router.put('/:id', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    updateCollege
);

// Delete college (protected, college admin only)
router.delete('/:id', 
    authMiddleware, 
    roleMiddleware(['collegeAdmin']), 
    deleteCollege
);

export default router; 