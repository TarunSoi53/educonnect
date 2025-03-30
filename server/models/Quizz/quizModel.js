import mongoose from "../config/index.js";

const quizzSchema = new mongoose.Schema({
    title: String,
    description: String,
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subjects"
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic"
    },
    notes: {
        type: String,
        default: ""
    },
    quizQuestions: [{
      type: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion', required: true} }]
});

const Quiz = mongoose.model("Quiz", quizzSchema); // Changed model name to "Quiz"

export default Quiz;