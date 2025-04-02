import mongoose from 'mongoose';
import dotenv from 'dotenv'; // If you're using dotenv

dotenv.config(); // Load environment variables from .env file

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

export default mongoose;