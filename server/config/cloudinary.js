import { v2 as cloudinary } from "cloudinary";
// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for different types of uploads if needed
// Generic image storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'college_community', // Folder in Cloudinary
//     allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'avif'], // Allowed formats
//     // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional transformations
//   },
// });





const storage = multer.diskStorage({
  // destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage: storage });
export {cloudinary};




