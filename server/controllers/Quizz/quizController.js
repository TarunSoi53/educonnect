import Quiz from '../../models/Quizz/quizModel.js';
import QuizQuestion from '../../models/Quizz/QuizQuestionModel.js';
import SubmitQuiz from '../../models/Quizz/SubmitQuizModel.js';
import Subject from '../../models/Subject/SubjectModel.js';

// Get quiz stats for a teacher
export const getQuizStats = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const [totalQuizzes, totalQuestions, submissions] = await Promise.all([
      Quiz.countDocuments({ teacher: teacherId }),
      QuizQuestion.countDocuments({ quizId: { $in: await Quiz.find({ teacherId: teacherId }).distinct('_id') } }),
      SubmitQuiz.find({ quizId: { $in: await Quiz.find({ teacher: teacherId }).distinct('_id') } })
    ]);

    const averageScore = submissions.length > 0
      ? submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length
      : 0;

    res.json({
      totalQuizzes,
      totalQuestions,
      averageScore,
      totalSubmissions: submissions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all quizzes for a teacher
export const getTeacherQuizzes = async (req, res) => {
  try {
    const { teacherId } = req.user._id;
    console.log(teacherId);
    //  const { department, section } = req.query;

    // // let query = { teacher: teacherId };

    // // if (department) {
    // //   const subjects = await Subject.find({ department });
    // //   query.subjectId = { $in: subjects.map(s => s._id) };
    // // }

    // // if (section) {
    // //   const subjects = await Subject.find({ section });
    // //   query.subjectId = { $in: subjects.map(s => s._id) };
    // // }

    const quizzes = await Quiz.find(teacherId)
      .sort({ createdAt: -1 })
      .populate('subjectId', 'name')
      .populate('topic', 'name');
    

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz details with questions
export const getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
      .populate('subjectId', 'name code')
      .populate('topic', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questions = await QuizQuestion.find({ quizId })
      .sort('questionNo');

    res.json({
      ...quiz.toObject(),
      quizQuestions: questions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
export const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

   
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { status: 'active' },
      { new: true } // Return the updated document
    );

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // const questions = await QuizQuestion.find({ quizId })
    //   .sort('questionNo');

    res.json({
     message: 'Quiz started successfully',
      quiz: {
        ...quiz.toObject(),
        // quizQuestions: questions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get quiz list for students based on section and department
// Adjust the path to your Quiz model

// export const getQuizList = async (req, res) => {

//     try {
//       console.log("req user data ", req.user);
//         // const { section, department } = req.params;
//         // const today = new Date();
//         // const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
//         // const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
//         // console.log("Section:", section, "Department:", department);

//         // // Filtering by the date part of the createdAt field
//         // const quizzes = await Quiz.find({
//         //     section: section,
//         //     Department: department,
//         //     createdAt: { $gte: startOfDay, $lte: endOfDay }
//         // })
//         // .populate('subjectId', 'name code')
//         // .populate('topic', 'name');

//         // console.log("Fetched Quizzes (based on createdAt):", quizzes);
//         res.json(req.user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
export const getQuizList = async (req, res) => {

    try {
      console.log("req user data ", req.user);
        const { section, department } = req.user;
        console.log("section aa",section)
        console.log("department bb",department)
       
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        console.log("Section:", section, "Department:", department);

        // Filtering by the date part of the createdAt field
        const quizzes = await Quiz.find({
            section: section.toString(),
            department: department.toString(),
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        })
        .populate('subjectId', 'name')
        .populate('topic', 'name')
        .populate('teacherId', 'name');

        console.log("Fetched Quizzes (based on createdAt):", quizzes);
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const userSubmitQuiz = async (req, res) => {
  try {
    const { quizId,  quizAnswers } = req.body;
    console.log("quizId",quizId)
    console.log("quizAnswers",quizAnswers)

    // Basic validation
    if (!quizId  || !Array.isArray(quizAnswers)) {
      return res.status(400).json({ message: 'Invalid submission data.' });
    }

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    const quizQuestions = await QuizQuestion.find({ quizId })
      .sort('questionNo');
    console.log("quiz",quiz)
    console.log("quizQuestions",quizQuestions)

    let score = 0;
    const processedAnswers = quizQuestions.map((question, index) => {
      const submittedAnswer = quizAnswers.find(ans => ans.questionId === question._id.toString());
      const selectedAnswer = submittedAnswer ? submittedAnswer.selectedAnswer : undefined;
      const isCorrect = String(selectedAnswer) === String(question.correctAnswer); // Compare as strings
      if (isCorrect) {
        score++;
      }
      return {
        questionId: question._id,
        selectedAnswer: question.options[selectedAnswer], // Get the text of the selected option
        correctAnswer: question.options[question.correctAnswer], // Get the text of the correct option
        isCorrect: isCorrect,
      };
    });

    const timeTaken = req.body.timeTaken || 0; // Get time taken from request
    
console.log("processedAnswers",processedAnswers)
    const submission = new SubmitQuiz({
      quizId,
      studentId:req.user._id,
      quizAnsewrs: processedAnswers,
      score,
     
      timeTaken,
    });

     const savedSubmission = await submission.save();

     res.status(200).json({ message: 'Quiz submitted successfully!', score: savedSubmission.score, totalQuestions: quiz.quizQuestions.length, quizAnswers: savedSubmission.quizAnsewrs });
    // res.status(200).json({ message: 'Quiz submitted successfully!'});

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz.' });
  }
};