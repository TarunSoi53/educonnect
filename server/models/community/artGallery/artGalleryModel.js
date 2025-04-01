import mongoose from "../../config/index.js";


const ArtGalleryPostSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    
    title: { type: String, required: true },
    postUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String,  },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0
    },

    likes: {
        type: Number,
        default: 0
    },
   
    date: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: false
    },
     collegeId: {
            type: mongoose.Schema.Types.ObjectId,
                ref: "College"
           
        },




});

const ArtGalleryPost = mongoose.model("ArtGalleryPost", ArtGalleryPostSchema);

export default ArtGalleryPost;