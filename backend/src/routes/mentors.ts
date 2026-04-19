import express from "express";
import mongoose from "mongoose";
import { demoMentors } from "../constants/demoData";
import Mentor from "../models/Mentor";

const router = express.Router();

const normalizeTokens = (values: string[]) =>
  values
    .flatMap((value) => value.toLowerCase().split(/[^a-z0-9]+/i))
    .filter(Boolean);

const parseQueryList = (value: unknown): string[] => {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

// Get all mentors
router.get("/", async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(demoMentors);
    }

    const mentors = await Mentor.find().populate("user");
    if (mentors.length === 0) {
      return res.json(demoMentors);
    }
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

router.get("/recommendations", async (req, res) => {
  try {
    const interests = parseQueryList(req.query.interests);
    const skills = parseQueryList(req.query.skills);
    const referenceTokens = normalizeTokens([...interests, ...skills]);

    const mentors =
      mongoose.connection.readyState === 1
        ? await Mentor.find().populate("user")
        : [...demoMentors];

    const recommendations = mentors
      .map((mentor) => {
        const mentorName =
          typeof mentor.user === "object" && mentor.user !== null && "profile" in mentor.user
            ? (mentor.user.profile as { name?: string } | undefined)?.name || "Mentor"
            : "Mentor";

        const expertise = [...(mentor.expertise ?? [])];
        const expertiseTokens = normalizeTokens(expertise);
        const overlap = referenceTokens.filter((token) => expertiseTokens.includes(token));
        const matchScore = referenceTokens.length === 0 ? 72 : Math.min(98, 60 + overlap.length * 12);

        return {
          _id: String(mentor._id),
          mentorName,
          expertise,
          matchScore,
          status: "suggested",
          createdAt: new Date().toISOString(),
          message:
            overlap.length > 0
              ? `${mentorName} correspond bien a votre profil grace a ses expertises en ${overlap.join(", ")}.`
              : `${mentorName} peut vous accompagner sur la structuration du sujet, le suivi des jalons et la soutenance.`,
        };
      })
      .sort((left, right) => right.matchScore - left.matchScore)
      .slice(0, 3);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate mentor recommendations" });
  }
});

// Assign mentor to student
router.post("/assign", async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    if (!studentId || !mentorId) {
      return res.status(400).json({ error: "studentId and mentorId are required" });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Mentor assigned successfully (demo mode)" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const alreadyAssigned = mentor.students.some((student) => String(student) === String(studentId));
    if (!alreadyAssigned) {
      mentor.students.push(studentId);
      await mentor.save();
    }

    res.json({ message: "Mentor assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign mentor" });
  }
});

export default router;
