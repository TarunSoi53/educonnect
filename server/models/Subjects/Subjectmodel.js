import mongoose from "../config/index.js";

const SubjectSchema = new mongoose.Schema({
  collegeId: {
    type: String,
    required: true,
  },

  departmentId: {
    type: String,
  },

  // Add more fields as needed

  subjectName: {
    type: String,
    required: true,
  },
  subjectDescription: {
    type: String,
    required: true,
  },

  subjectCode: {
    type: String,
  },
  Sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sections",
    },
  ],
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],

  // Add more fields as needed
});

const Subjects = mongoose.model("Subjects", SubjectSchema);

export default Subjects;
