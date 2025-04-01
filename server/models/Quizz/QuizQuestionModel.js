import mongoose from "../../config/index.js";
const quizQuestionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: String,
   
});
const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);