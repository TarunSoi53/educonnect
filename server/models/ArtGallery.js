const mongoose = require('mongoose');

const artGallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
   
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'uploadedByModel'
  },
  uploadedByModel: {
    type: String,
    required: true,
    enum: ['Teacher', 'Student']
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'College'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ArtGallery', artGallerySchema); 