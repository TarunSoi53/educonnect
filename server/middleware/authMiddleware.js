import jwt from 'jsonwebtoken';
import CollegeAdmin from '../models/UserModel/collegeAdmin/collegeAdminModel.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';
import Student from '../models/UserModel/Students/StudentModel.js';

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user based on role
        let user;
        switch (decoded.role) {
            case 'collegeAdmin':
                user = await CollegeAdmin.findById(decoded.id).select('-password');
                break;
            case 'teacher':
                user = await Teacher.findById(decoded.id).select('-password');
                break;
            case 'student':
                user = await Student.findById(decoded.id).select('-password');
                break;
            default:
                return res.status(401).json({ message: 'Invalid user role' });
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.user.role = decoded.role;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Middleware to check specific roles
// export const checkRole = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.userRole)) {
//             return res.status(403).json({ 
//                 message: 'Access denied. Insufficient permissions.' 
//             });
//         }
//         next();
//     };
// }; 