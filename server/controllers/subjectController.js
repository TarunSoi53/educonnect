import Subject from '../models/Subject/SubjectModel.js';
import Student from '../models/UserModel/Students/StudentModel.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';
import ChatGroup from '../models/ChatGroup/ChatGroupModel.js';


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

     // Find all students in this department and section
     const students = await Student.find({
      
      department,
      section,
    });

    // Create a chat group for this subject
    const chatGroup = new ChatGroup({
      name: `${name} Group`,
      subjectId: newSubject._id,
      members: [
        teacherId, // Add teacher
        ...students.map(student => student._id) // Add all students
      ]
    });

    await chatGroup.save();

    // Update subject with chat group ID
    newSubject.chatGroupId = chatGroup._id;
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

// Delete a subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check ownership
    if (subject.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the associated chat group
    if (subject.chatGroupId) {
      await ChatGroup.findByIdAndDelete(subject.chatGroupId);
    }

    await subject.remove();

    res.json({ message: 'Subject removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};