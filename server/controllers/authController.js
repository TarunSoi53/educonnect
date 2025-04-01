import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CollegeAdmin from '../models/UserModel/collegeAdmin/collegeAdminModel.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';
import Student from '../models/UserModel/Students/studentModel.js';
import Sections from '../models/Department/SectionModel.js';
import Department from '../models/Department/Departmentmodel.js';

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// College Admin Registration
export const registerCollegeAdmin = async (req, res) => {
    try {
        const {  name,email, password, phoneNumber } = req.body;


        // Check if admin already exists
        const adminExists = await CollegeAdmin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'College admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate unique college ID
      

        // Create new admin
        const admin = await CollegeAdmin.create({
         
          name,
            email,
            password: hashedPassword,
           
            phoneNumber
        });

        // Generate token
        const token = generateToken(admin._id, 'admin');
        

        res.status(201).json({
            _id: admin._id,
            collegeName: admin.collegeName,
            collegeId: admin.collegeId,
            email: admin.email,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Teacher Registration
export const registerTeacher = async (req, res) => {
    try {
        const { username, name, email, password, department, collegeId, phoneNumber } = req.body;

        // Check if teacher exists
        const teacherExists = await Teacher.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({ message: 'Teacher already exists' });
        }

        // Verify college ID
        const college = await CollegeAdmin.findOne({ collegeId });
        if (!college) {
            return res.status(400).json({ message: 'Invalid college ID' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new teacher
        const teacher = await Teacher.create({
            username,
            name,
            email,
            password: hashedPassword,
            department,
            collegeId,
            phoneNumber
        });

        // Generate token
        const token = generateToken(teacher._id, 'teacher');

        res.status(201).json({
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            department: teacher.department,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student Registration
export const registerStudent = async (req, res) => {
    try {
        const { username, name, email, password, collegeId, department, section,rollNumber } = req.body;
        

        // Check if student exists
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Verify college ID
        const college = await CollegeAdmin.findOne({ collegeId });
        if (!college) {
            return res.status(400).json({ message: 'Invalid college ID' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new student
        const student = await Student.create({
            username,
            name,
            email,
            password: hashedPassword,
            collegeId,
            department,
            section,
            rollNumber
        });
        const sectionModel = await Sections.findOne({_id:section});
        if (!sectionModel) {
            return res.status(400).json({ message: 'Invalid section' });
        }
         sectionModel.students.push(student._id);
        await sectionModel.save();
        const departmentModel = await Department.findOne({_id: department });
        if (!departmentModel) {
            return res.status(400).json({ message: 'Invalid department' });
        }
        
        departmentModel.students.push(student._id);
    
        await departmentModel.save();


        // Generate token
        const token = generateToken(student._id, 'student');

        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            department: student.department,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login for all roles
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check all user types
        let user = await CollegeAdmin.findOne({ email });
        let role = 'collegeAdmin';

        if (!user) {
            user = await Teacher.findOne({ email });
            role = 'teacher';
        }

        if (!user) {
            user = await Student.findOne({ email });
            role = 'student';
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id, role);

        res.json({
            _id: user._id,
            name: user.name || user.collegeName,
            email: user.email,
            role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 