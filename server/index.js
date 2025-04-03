import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import topicRoutes from './routes/Subject/TopicRoutes.js';



// import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/sections', sectionRoutes);

app.use('/api/colleges', collegeRoutes);

app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/communityPages', communityRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes); 

// app.use('/api/quizzes', quizRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
// Create uploads directory if it doesn't exist



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 