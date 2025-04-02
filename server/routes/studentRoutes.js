import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

import Student from '../models/UserModel/Students/StudentModel.js';

const router = express.Router();

// Get student profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId)
      .populate('department', 'name')
      .populate('section', 'name')
      .populate('college', 'name');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student profile' });
  }
});

// Update student profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user.userId,
      { name, phone },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student profile' });
  }
});

// Get all students in a section
router.get('/section/:sectionId', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({ section: req.params.sectionId })
      .populate('department', 'name')
      .populate('section', 'name')
      .populate('college', 'name');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section students' });
  }
});

// Get all students in a department
router.get('/department/:departmentId', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.departmentId })
      .populate('department', 'name')
      .populate('section', 'name')
      .populate('college', 'name');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department students' });
  }
});

// Get student's teachers (if they are assigned to any)
router.get('/teachers', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId)
      .populate('department', 'name');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Here you would typically fetch teachers based on the student's department and section
    // This is a placeholder - you'll need to implement the actual logic based on your requirements
    res.json({ message: 'Student teachers endpoint - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student teachers' });
  }
});

export default router; 