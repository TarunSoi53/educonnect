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