import mongoose from "../../config/index.js";

const SectionSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
   collegeId: {
          type: mongoose.Schema.Types.ObjectId,
              ref: "College"
         
      },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Sections = mongoose.model("Sections", SectionSchema);

export default Sections;
