import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import mentorRoutes from './routes/mentors';
import evaluationRoutes from './routes/evaluations';
import certificationRoutes from './routes/certifications';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Swagger definition
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AI-PFE Platform API',
    version: '1.0.0',
    description: 'API for AI-powered PFE supervision platform',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Development server',
    },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  role: { type: 'string', enum: ['student', 'mentor', 'admin'] },
                  profile: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          500: { description: 'Registration failed' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { type: 'object' }
                  }
                }
              }
            }
          },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/evaluations/evaluate': {
      post: {
        summary: 'Evaluate student level',
        tags: ['Evaluations'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  answers: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Evaluation completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    evaluation: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/evaluations/recommend-path': {
      post: {
        summary: 'Recommend personalized path',
        tags: ['Evaluations'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  level: { type: 'string' },
                  interests: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Path recommended',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    path: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-pfe')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/certifications', certificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI-PFE Backend is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AI-PFE Backend API', endpoints: ['/api/health', '/api/auth', '/api/users', '/api/projects', '/api/mentors', '/api/evaluations', '/api/certifications'] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;