import mongoose from "../config/index.js";
const TopicSchema = new mongoose.Schema({
  title: String,
  description: String,
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  TeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  notes: {
    type: String,
    default: "",
  },
});
const Topic = mongoose.model("Topics", TopicSchema);

export default Topic;
