import express from "express";
import mongoose from "mongoose";
import { demoProjects } from "../constants/demoData";
import Project from "../models/Project";

const router = express.Router();

// Get all projects
router.get("/", async (req, res) => {
  try {
    const studentId = typeof req.query.studentId === "string" ? req.query.studentId : undefined;

    if (mongoose.connection.readyState !== 1) {
      const fallbackProjects = studentId
        ? demoProjects.filter((project) => project.student === studentId || studentId === "demo-student")
        : demoProjects;
      return res.json(fallbackProjects);
    }

    const query = studentId ? { student: studentId } : {};
    const projects = await Project.find(query).populate("student mentor");
    if (projects.length === 0) {
      return res.json(demoProjects);
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Create project
router.post("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database unavailable in demo mode" });
    }

    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const fallbackProject = demoProjects.find((project) => project._id === req.params.id);
      if (!fallbackProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.json(fallbackProject);
    }

    const project = await Project.findById(req.params.id).populate("student mentor");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database unavailable in demo mode" });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

export default router;
