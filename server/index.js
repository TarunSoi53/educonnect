import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
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
import chatRoutes from './routes/chatgroup/chatRoutes.js';


import quizRoutes from './routes//Quizz/quizRoutes.js';
import  {setupSocket} from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);


// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
setupSocket(server);
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
app.use('/api/community', communityRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes); 

 app.use('/api/quizzes', quizRoutes);
 app.use('/api/chat', chatRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
// Create uploads directory if it doesn't exist



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 