import mongoose from "../config/index.js";


const ArtGalleryPostSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
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
    comments: {
        type: [String],
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    },
//  friendRequestsReceived: {
//         type: [mongoose.Schema.Types.ObjectId], // Store IDs of users who have sent this user friend requests
//         ref: 'User',
//         default: []
//     },
//     friendRequestsSent: {
//         type: [mongoose.Schema.Types.ObjectId], // Store IDs of users who have sent this user friend requests
//         ref: 'User',
//         default: []
//     }



});

const ArtGalleryPost = mongoose.model("ArtGalleryPost", ArtGalleryPostSchema);

export default ArtGalleryPost;