import mongoose from "../../../config/index.js";


const ArtGalleryPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderRole'
    },
    userRole: {
        type: String,
        required: true,
        enum: ['Teacher', 'Student']
    },
    
    title: { type: String, required: true },
    postUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String,  },
    tags: {
        type: [String],
        default: []
    },
    imagePublicId:{ type: String, required: true },

    likes: {
        type: Number,
        default: 0
    },
   
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
     collegeId: {
            type: mongoose.Schema.Types.ObjectId,
                ref: "College"
           
        },


});

const ArtGallery = mongoose.model("ArtGallery", ArtGalleryPostSchema);

export default ArtGallery;