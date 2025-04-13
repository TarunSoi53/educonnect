import mongoose from "../../config/index.js";
import Department from "../Department/Departmentmodel.js";

const quizzSchema = new mongoose.Schema({
    title: String,
    description: String,
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subjects"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
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
    teacherId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Teacher',
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'], // Define the allowed status values
        default: 'pending' // Set a default status
      },
    quizQuestions: [{
      type: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion', required: true} }]
      
});

const Quiz = mongoose.model("Quiz", quizzSchema); // Changed model name to "Quiz"

export default Quiz;