import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor', 'admin'], required: true },
  profile: {
    name: String,
    skills: [String],
    level: String,
    interests: [String],
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);