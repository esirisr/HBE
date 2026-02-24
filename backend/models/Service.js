
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  provider: {
    type: Number,
    ref: 'Provider'
  },
  description: String
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
