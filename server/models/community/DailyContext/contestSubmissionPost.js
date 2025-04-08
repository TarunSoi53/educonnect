import mongoose from "../../../config";
const contestSubmissionPostSchema = new mongoose.Schema({
    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0,
    },
    
    imagepostURL: {
        type: String,
       
    },
    videoPostURL: {
        type: String,
        
    },
    description: {
        type: String,
        required: true,
    },

    isWinner: {
        type: Boolean,
        default: false,
    },
    isReviewed: {
        type: Boolean,
        default: false,
    },
    });
const ContestSubmissionPost = mongoose.model(
    "ContestSubmissionPost",
    contestSubmissionPostSchema
);
export default ContestSubmissionPost;