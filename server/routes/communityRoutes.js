
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import ArtGallery from '../models/community/artGallery/artGalleryModel.js';
import { cloudinary, upload } from '../config/cloudinary.js';

import path from 'path';


const router = express.Router();


// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/art-gallery')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname))
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5000000 }, // 5MB limit
//   fileFilter: function (req, file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images Only!');
//     }
//   }
// });

// Get all approved art gallery items for a college
router.get('/art-gallery', authMiddleware, async (req, res) => {
  try {
    const artItems = await ArtGallery.find({
      college: req.user.college,
      status: 'approved'
    }).populate('uploadedBy', 'name');
    res.json(artItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new art gallery item (for teachers and students)
router.post('/art-gallery/upload', authMiddleware, upload.single('artgallery'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });

    }
    const file = req.file.path;
    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "art-gallery",
    });
console.log(cloudinaryResponse);
const userRole = req.user.role; // Assuming req.user.role is either 'teacher' or 'student'
const userId = req.user._id;

const artItem = new ArtGallery({
    title: req.body.title,
    description: req.body.description,
    postUrl: cloudinaryResponse.secure_url,
    imagePublicId: cloudinaryResponse.public_id,
    category: req.body.category,
    userId: userId,
    userRole: userRole.charAt(0).toUpperCase() + userRole.slice(1), // Ensure 'Teacher' or 'Student'
    collegeId: req.user.college, // Assuming req.user.college holds the college ObjectId
    status: 'pending' // Set the initial status
});

await artItem.save();
res.status(201).json(artItem);
   
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get pending art gallery items (for college admin)
router.get('/art-gallery/pending', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'collegeAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pendingItems = await ArtGallery.find({
      college: req.user.college,
      status: 'pending'
    }).populate('uploadedBy', 'name');
    res.json(pendingItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject art gallery item (for college admin)
router.patch('/art-gallery/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'collegeAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, rejectionReason } = req.body;
    const artItem = await ArtGallery.findOne({
      _id: req.params.id,
      college: req.user.college
    });

    if (!artItem) {
      return res.status(404).json({ message: 'Art item not found' });
    }

    artItem.status = status;
    if (status === 'rejected' && rejectionReason) {
      artItem.rejectionReason = rejectionReason;
    }

    await artItem.save();
    res.json(artItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's uploaded art gallery items
router.get('/art-gallery/my-uploads', authMiddleware, async (req, res) => {
  try {
    const myUploads = await ArtGallery.find({
      uploadedBy: req.user._id,
      college: req.user.college
    });
    res.json(myUploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 