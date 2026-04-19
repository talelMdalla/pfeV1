import express from "express";
import { demoPartnerCompanies, type PartnerCompany } from "../constants/demoData";

const router = express.Router();

const parseSkills = (value: unknown): string[] => {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalize = (value: string) => value.toLowerCase();

const matchScore = (company: PartnerCompany, studentSkills: string[]): number => {
  if (studentSkills.length === 0) {
    return 55;
  }

  const studentNorm = studentSkills.map(normalize);
  const requiredNorm = company.requiredSkills.map(normalize);
  let hits = 0;

  for (const req of requiredNorm) {
    if (studentNorm.some((s) => req.includes(s) || s.includes(req))) {
      hits += 1;
    }
  }

  return Math.min(98, 48 + hits * 14 + Math.min(3, studentNorm.length) * 2);
};

/**
 * Liste des entreprises partenaires pour l'insertion professionnelle et les stages PFE.
 * Query optionnelle : ?skills=React,Python pour trier par adéquation avec le profil.
 */
router.get("/", (req, res) => {
  const skills = parseSkills(req.query.skills);
  const enriched = demoPartnerCompanies
    .map((company) => ({
      ...company,
      matchScore: matchScore(company, skills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json(enriched);
});

export default router;
