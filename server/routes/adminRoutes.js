import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Department from '../models//Department/Departmentmodel.js';
import Section from '../models/Department/SectionModel.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';
import Student from '../models/UserModel/Students/StudentModel.js';
const router = express.Router();

// Get dashboard data
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const collegeId = req.user.college;

    // Get departments
    const departments = await Department.find({ college: collegeId });
    
    // Get teachers
    const teachers = await Teacher.find({ college: collegeId });
    
    // Get students
    const students = await Student.find({ college: collegeId });

    // Get sections for each department
    const departmentsWithSections = await Promise.all(
      departments.map(async (dept) => {
        const sections = await Section.find({ department: dept._id });
        return {
          ...dept.toObject(),
          sections: sections
        };
      })
    );

    res.json({
      departments: departmentsWithSections,
      teachers,
      students
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get college departments
router.get('/college/:collegeId/departments', authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find({ college: req.params.collegeId });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

// Get college teachers
router.get('/college/:collegeId/teachers', authMiddleware, async (req, res) => {
  try {
    const teachers = await Teacher.find({ college: req.params.collegeId });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers' });
  }
});

// Get college students
router.get('/college/:collegeId/students', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find({ college: req.params.collegeId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Get department sections
router.get('/department/:departmentId/sections', authMiddleware, async (req, res) => {
  try {
    const sections = await Section.find({ department: req.params.departmentId });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sections' });
  }
});

export default router; 