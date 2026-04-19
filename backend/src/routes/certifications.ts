import express from "express";
import mongoose from "mongoose";
import { demoCertifications } from "../constants/demoData";
import Certification from "../models/Certification";

const router = express.Router();

// Get all certifications
router.get("/", async (req, res) => {
  try {
    const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;

    if (mongoose.connection.readyState !== 1) {
      const fallbackCertifications = userId
        ? demoCertifications.filter((certification) => certification.user === userId || userId === "demo-student")
        : demoCertifications;
      return res.json(fallbackCertifications);
    }

    const query = userId ? { user: userId } : {};
    const certifications = await Certification.find(query).populate("user");
    if (certifications.length === 0) {
      return res.json(demoCertifications);
    }
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

// Issue certification
router.post("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database unavailable in demo mode" });
    }

    const certification = new Certification(req.body);
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ error: "Failed to issue certification" });
  }
});

export default router;
