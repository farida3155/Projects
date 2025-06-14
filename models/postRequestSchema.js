const mongoose = require('mongoose');

const postRequestSchema = new mongoose.Schema({
  petDetails: {
    name: { type: String, required: true },
    age: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, enum: ['months', 'years'] }
    },
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
    neutered: { type: String, required: true, enum: ['Yes', 'No'] },
    breed: { type: String, required: true },
    type: { type: String, required: true, enum: ['Cat', 'Dog'] },
    location: { type: String, required: true },
    healthInfo: {
      hasDisease: { type: String, required: true, enum: ['Yes', 'No'] },
      medication: { type: String, default: null }
    },
    behavior: {
      goodWithChildren: { type: String, required: true },
      notes: { type: String, default: '' }
    }
  },
  ownerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  homePreferences: { type: String },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PostRequest', postRequestSchema);