import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';


const router = express.Router();

// Get teacher profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.userId)
      .populate('department', 'name')
      .populate('college', 'name');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher profile' });
  }
});

// Update teacher profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, subjects } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.user.userId,
      { name, phone, subjects },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher profile' });
  }
});

// Get all teachers in a department
router.get('/department/:departmentId/', authMiddleware, async (req, res) => {
  try {
    const teachers = await Teacher.find({ department: req.params.departmentId });
      // .populate('department', 'name')
      // .populate('college', 'name');
    
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department teachers' });
  }
});

// Get teacher's students (if they are assigned to any sections)
router.get('/students', authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.userId)
      .populate('department', 'name');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Here you would typically fetch students based on the teacher's assigned sections
    // This is a placeholder - you'll need to implement the actual logic based on your requirements
    res.json({ message: 'Teacher students endpoint - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher students' });
  }
});

export default router; 