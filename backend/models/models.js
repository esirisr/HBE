import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },

  number: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12,
    match: [/^\d{12}$/, 'Phone number must be exactly 12 digits']
  },

  location: {
    type: String,
    required: true,
    trim: true
  },

  skill: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  }

}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
