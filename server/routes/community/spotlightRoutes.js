
import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import Spotlight from '../../models/community/spotlight/spotlightModel.js';
import { cloudinary, upload } from '../../config/cloudinary.js';

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
router.get('/', authMiddleware, async (req, res) => {
  try {
    const SpotlightItems = await Spotlight.find({
      collegeId: req.user.collegeId,
      status: 'approved'
    }).populate('userId', 'name');
    res.json(SpotlightItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload new art gallery item (for teachers and students)
router.post('/upload', authMiddleware, upload.single('Spotlight'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });

    }
    const file = req.file.path;
    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "spotlight",
    });
console.log(cloudinaryResponse);
const userRole = req.role; // Assuming req.user.role is either 'teacher' or 'student'
const userId = req.user._id;

const SpotlightItem = new Spotlight({
    title: req.body.title,
    description: req.body.description,
    postUrl: cloudinaryResponse.secure_url,
    imagePublicId: cloudinaryResponse.public_id,
    category: req.body.category,
    userId: userId,
    userRole: userRole.charAt(0).toUpperCase() + userRole.slice(1), // Ensure 'Teacher' or 'Student'
    collegeId: req.user.collegeId, // Assuming req.user.college holds the college ObjectId
    status: 'pending' // Set the initial status
});
console.log("this is return from the spotlight ",SpotlightItem)

await SpotlightItem.save();
console.log("Spotlight item saved:", SpotlightItem);
res.status(201).json(SpotlightItem);
   
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get pending art gallery items (for college admin)
// router.get('/pending', authMiddleware, async (req, res) => {
//   try {
//     if (req.role !== 'collegeAdmin') {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     console.log("College ID from request:", req.user.collegeId);
//     console.log("College ID from request:", req.role);

//     const pendingItems = await ArtGallery.find({
//       collegeId: req.user.collegeId,
//       status: 'pending'})
//     // }).populate('userId', 'name');
//     console.log("Pending items found:", pendingItems);
//     res.json(pendingItems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get('/pending', authMiddleware, async (req, res) => {
  try {
      if (req.role !== 'collegeAdmin') {
          return res.status(403).json({ message: 'Access denied' });
      }
      console.log("College ID from request:", req.user.collegeId);
      console.log("User role from request:", req.role);

      const allPendingItems = await Spotlight.find({ status: 'pending' });
      console.log("All pending items (regardless of college):", allPendingItems.map(item => ({ _id: item._id, collegeId: item.collegeId })));

      const pendingItems = await Spotlight.find({
          collegeId: req.user.collegeId,
          status: 'pending'
      });
      console.log("Pending items found (filtered by college):", pendingItems);
      res.json(pendingItems);
  } catch (error) {
      console.error("Error fetching pending Spotlight items:", error);
      res.status(500).json({ message: error.message });
  }
});
// Approve or reject art gallery item (for college admin)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.role !== 'collegeAdmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, rejectionReason } = req.body;
    const SpotlightItem = await Spotlight.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId
    });
    console.log("Spotlight item found:", SpotlightItem);

    if (!SpotlightItem) {
      return res.status(404).json({ message: 'spotlight item not found' });
    }

    SpotlightItem.status = status;
    if (status === 'rejected' && rejectionReason) {
      SpotlightItem.rejectionReason = rejectionReason;
    }

    await SpotlightItem.save();
    res.json(SpotlightItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's uploaded art gallery items
router.get('/my-uploads', authMiddleware, async (req, res) => {
  try {
    const myUploads = await Spotlight.find({
      userId: req.user._id,
      collegeId: req.user.collegeId
    });
    res.json(myUploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 