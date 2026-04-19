import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth";
import certificationRoutes from "./routes/certifications";
import companyRoutes from "./routes/companies";
import evaluationRoutes from "./routes/evaluations";
import mentorRoutes from "./routes/mentors";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/users";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-pfe";

// Swagger definition
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "AI-PFE Platform API",
    version: "1.1.0",
    description: "API for the AI-powered PFE supervision platform",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Development server",
    },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "role"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  role: { type: "string", enum: ["student", "mentor", "admin"] },
                  profile: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          500: { description: "Registration failed" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { type: "object" },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/evaluations/evaluate": {
      post: {
        summary: "Evaluate student level",
        tags: ["Evaluations"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  answers: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Evaluation completed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    evaluation: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/evaluations/recommend-path": {
      post: {
        summary: "Recommend personalized path",
        tags: ["Evaluations"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  level: { type: "string" },
                  interests: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Path recommended",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    path: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// Database connection
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 4000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.warn("MongoDB connection unavailable, demo mode remains active.", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/companies", companyRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    message: "AI-PFE Backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "demo",
  });
});

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to AI-PFE Backend API",
    mode: mongoose.connection.readyState === 1 ? "database" : "demo",
    endpoints: [
      "/api/health",
      "/api-docs",
      "/api/auth",
      "/api/users",
      "/api/projects",
      "/api/mentors",
      "/api/evaluations",
      "/api/certifications",
      "/api/companies",
    ],
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
