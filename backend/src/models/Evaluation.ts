import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profileLabel: { type: String, required: true },
    summary: { type: String, required: true },
    aiRecommendation: { type: String, required: true },
    strengths: [{ type: String }],
    nextSteps: [{ type: String }],
    recommendedTopics: [{ type: String }],
    skills: [{ type: String }],
    interests: [{ type: String }],
    goals: [{ type: String }],
    experience: { type: String, default: "intermediaire" },
    overallScore: { type: Number, default: 70 },
  },
  { timestamps: true },
);

export default mongoose.model("Evaluation", evaluationSchema);
