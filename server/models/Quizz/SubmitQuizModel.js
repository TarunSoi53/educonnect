import mongoose from "../../config/index.js";

const submitQuizSchema = new mongoose.Schema({
    quizId: { type: String, required: true },
    studentId: { type: String, required: true },
    
    quizAnsewrs: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion', required: true },
        selectedAnswer: String,
        isCorrect: { type: Boolean, default: false },
    }],
    score: { type: Number, required: true },
    attempts: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
});
const submitQuiz = mongoose.model('submitQuiz', submitQuizSchema);
export default submitQuiz;