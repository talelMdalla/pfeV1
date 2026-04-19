import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['proposed', 'in_progress', 'completed'], default: 'proposed' },
  progress: { type: Number, default: 0 },
  milestones: [{
    title: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
  }],
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);