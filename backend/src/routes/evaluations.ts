import express from "express";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import { demoMentors } from "../constants/demoData";
import Evaluation from "../models/Evaluation";

const router = express.Router();
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

type EvaluationPayload = {
  studentId?: string;
  answers?: string[];
  skills?: string[];
  interests?: string[];
  goals?: string[];
  experience?: string;
};

type BuiltEvaluation = {
  profileLabel: string;
  summary: string;
  aiRecommendation: string;
  strengths: string[];
  nextSteps: string[];
  recommendedTopics: string[];
  skills: string[];
  interests: string[];
  goals: string[];
  experience: string;
  overallScore: number;
};

// Initialize Groq client only if API key is available
let groq: Groq | null = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (error) {
  console.warn("Groq client initialization failed:", error);
}

const ensureStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const unique = (items: string[]) => Array.from(new Set(items));

const inferProfileLabel = (skills: string[], interests: string[], goals: string[]): string => {
  const joined = [...skills, ...interests, ...goals].join(" ").toLowerCase();

  if (joined.includes("ml") || joined.includes("machine learning") || joined.includes("data")) {
    return "AI & Data Builder";
  }

  if (joined.includes("saas") || joined.includes("product") || joined.includes("interface")) {
    return "Full-Stack Product Builder";
  }

  if (joined.includes("cloud") || joined.includes("distributed") || joined.includes("architecture")) {
    return "Platform & Cloud Engineer";
  }

  return "Full-Stack Engineering Explorer";
};

const buildEvaluation = (payload: EvaluationPayload): BuiltEvaluation => {
  const answers = ensureStringArray(payload.answers);
  const skills = unique(ensureStringArray(payload.skills).length > 0 ? ensureStringArray(payload.skills) : answers);
  const interests = unique(ensureStringArray(payload.interests));
  const goals = unique(ensureStringArray(payload.goals));
  const experience = typeof payload.experience === "string" && payload.experience.trim() ? payload.experience : "intermediaire";
  const profileLabel = inferProfileLabel(skills, interests, goals);
  const strengths = unique([...skills.slice(0, 3), ...interests.slice(0, 2)]).slice(0, 4);
  const recommendedTopics = unique(
    [
      ...interests,
      ...skills.map((skill) => `${skill} applique au PFE`),
      "Gestion des livrables",
      "Preparation soutenance",
    ].filter(Boolean),
  ).slice(0, 5);
  const nextSteps = [
    "Valider un sujet PFE cible avec un encadrant en moins de 7 jours.",
    "Structurer une roadmap sur 6 semaines avec jalons et livrables.",
    "Planifier une revue hebdomadaire du prototype et des risques.",
  ];
  const overallScore = Math.min(96, 62 + strengths.length * 6 + interests.length * 4);

  return {
    profileLabel,
    summary: `Profil ${profileLabel} avec une base ${experience}. L'etudiant montre un potentiel clair sur ${strengths.join(", ")} et peut evoluer rapidement avec un encadrement cadence.`,
    aiRecommendation: `Priorite immediate : transformer vos competences en un PFE demonstrable. Orientez le projet vers ${recommendedTopics
      .slice(0, 3)
      .join(", ")} puis securisez un mentor specialise pour accelerer la livraison.`,
    strengths,
    nextSteps,
    recommendedTopics,
    skills,
    interests,
    goals,
    experience,
    overallScore,
  };
};

const enrichRecommendationWithGroq = async (evaluation: BuiltEvaluation) => {
  if (!groq) {
    return evaluation;
  }

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content:
            "Ameliore cette recommandation pour un etudiant PFE en 120 mots maximum. Reponds en francais.\n" +
            JSON.stringify({
              profileLabel: evaluation.profileLabel,
              skills: evaluation.skills,
              interests: evaluation.interests,
              goals: evaluation.goals,
              recommendation: evaluation.aiRecommendation,
            }),
        },
      ],
      max_tokens: 220,
    });

    const content = response.choices[0]?.message?.content?.trim();
    return content ? { ...evaluation, aiRecommendation: content } : evaluation;
  } catch (error) {
    console.warn("Groq enrichment failed, fallback kept.", error);
    return evaluation;
  }
};

/**
 * @swagger
 * /api/evaluations/evaluate:
 *   post:
 *     summary: Evaluate student level based on answers
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Evaluation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 evaluation:
 *                   type: string
 *       500:
 *         description: Evaluation failed
 */
router.post("/evaluate", async (req, res) => {
  try {
    const payload = req.body as EvaluationPayload;
    const evaluationInput = buildEvaluation(payload);
    const evaluation = await enrichRecommendationWithGroq(evaluationInput);

    if (mongoose.connection.readyState === 1 && payload.studentId && mongoose.Types.ObjectId.isValid(payload.studentId)) {
      const createdEvaluation = await Evaluation.create({
        student: payload.studentId,
        ...evaluation,
      });

      return res.status(201).json({
        _id: String(createdEvaluation._id),
        createdAt: createdEvaluation.createdAt,
        ...evaluation,
      });
    }

    res.json({
      _id: `demo-evaluation-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...evaluation,
    });
  } catch (error) {
    console.error("Erreur evaluation:", error);
    res.status(500).json({ error: "Evaluation echouee" });
  }
});

/**
 * @swagger
 * /api/evaluations/recommend-path:
 *   post:
 *     summary: Recommend a personalized PFE path
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: string
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Path recommendation generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
 *                   type: string
 *       500:
 *         description: Path recommendation failed
 */
router.post("/recommend-path", async (req, res) => {
  try {
    const level = typeof req.body?.level === "string" && req.body.level.trim() ? req.body.level.trim() : "intermediaire";
    const interests = ensureStringArray(req.body?.interests);
    const interestsText = interests.length > 0 ? interests.join(", ") : "developpement logiciel et innovation produit";

    if (!groq) {
      const path = `Parcours personnalise pour un etudiant niveau ${level} interesse par ${interestsText} : 1. Evaluation des competences, 2. Definition du sujet, 3. Attribution d'un mentor, 4. Livrables iteratifs, 5. Soutenance blanche et insertion.`;
      return res.json({ path });
    }

    const prompt = `En vous basant sur un niveau d'etudiant "${level}" et des interets dans ${interestsText}, recommandez un parcours PFE personnalise. Incluez des etapes specifiques, des technologies recommandees et des jalons. Repondez en francais.`;

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
    });

    const path = response.choices[0].message.content || "Recommandation de parcours generee";
    res.json({ path });
  } catch (error) {
    console.error("Erreur recommandation parcours:", error);
    res.status(500).json({ error: "Recommandation de parcours echouee" });
  }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.json([]);
    }

    const evaluations = await Evaluation.find({ student: studentId }).sort({ createdAt: -1 }).lean();
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch evaluations" });
  }
});

router.get("/demo/recommendations", (_req, res) => {
  const mentorHighlights = demoMentors.map((mentor) => ({
    mentorName: mentor.user.profile.name,
    expertise: mentor.expertise,
  }));

  res.json(mentorHighlights);
});

export default router;
