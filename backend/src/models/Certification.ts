import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  skills: [String],
  issuedDate: { type: Date, default: Date.now },
  issuer: String,
}, { timestamps: true });

export default mongoose.model('Certification', certificationSchema);