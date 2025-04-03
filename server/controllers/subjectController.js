import Subject from '../models/Subject/SubjectModel.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';

// Add a new subject
export const addSubject = async (req, res) => {
  try {
    const { name, department, section } = req.body;
    const teacherId = req.user._id;

    // Get teacher details
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const newSubject = new Subject({
      name,
      department,
      section,
      teacher: teacherId,
      collegeId: teacher.collegeId
    });

    await newSubject.save();

    // Add subject to teacher's subjects array
    teacher.subjects.push(newSubject._id);
    await teacher.save();

    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ message: 'Error adding subject' });
  }
};

// Get all subjects for a teacher
export const getTeacherSubjects = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const subjects = await Subject.find({ teacher: teacherId })
      .populate('department', 'name')
      .populate('section', 'name');

    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects' });
  }
};

// Get subjects by department and section
export const getSubjectsByDepartmentAndSection = async (req, res) => {
  try {
    const { departmentId, sectionId } = req.params;
    const subjects = await Subject.find({
      department: departmentId,
      section: sectionId
    }).populate('teacher', 'name');

    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects' });
  }
}; 