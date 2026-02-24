
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    unique:true,

  },

  number: {
    type: Number,

  },
  location: {
    type: String,
 
 
  },
   skill: {
    type: String},
  description: String
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
