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
    match: [/^252\d{9}$/, 'Phone number must be in format 252XXXXXXXXX'],
    validate: {
      validator: function (v) {
        return v.length === 12;
      },
      message: 'Phone number must be exactly 12 digits'
    }
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
