import mongoose from "../../../config";

const ContestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  // departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  createdAt: { type: Date, default: Date.now },
  participatents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "contestSubmissionPost" },
  ],
});

const Contest = mongoose.model("Contest", ContestSchema);
export default Contest;
