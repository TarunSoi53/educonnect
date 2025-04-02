// import express from 'express';
// import { authMiddleware } from '../middleware/authMiddleware.js';
// import { roleMiddleware } from '../middleware/roleMiddleware.js';
// import {
//   generateNewQuiz,
//     getquiz,
//     updateQuiz,
//     deletequiz
// } from '../controllers/sectionController.js';

// const router = express.Router();

// // All routes are protected and only accessible by college admin


// // Section routes
// router.post('/:departmentId/addsections', 
//     authMiddleware, 
//     roleMiddleware(['collegeAdmin']), 
//     addSection
// );

// router.get('/:departmentId/sections', getSections);

// router.put('/:departmentId/sections/:sectionId', 
//     authMiddleware, 
//     roleMiddleware(['collegeAdmin']), 
//     updateSection
// );

// router.delete('/:departmentId/sections/:sectionId', 
//     authMiddleware, 
//     roleMiddleware(['collegeAdmin']), 
//     deleteSection
// );

// export default router; 

