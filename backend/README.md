# AI-PFE Backend

Backend API for the AI-powered PFE supervision platform.

## Features

- User authentication and authorization
- AI-powered student evaluation
- Personalized learning paths
- Project management
- Mentor assignment and recommendations
- Certification system
- Demo fallback mode when MongoDB is unavailable

## Technologies

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Groq / OpenAI-ready AI integration
- JWT for authentication
- Swagger UI

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-pfe
   JWT_SECRET=change-me
   CLIENT_URL=http://localhost:8080
   GROQ_API_KEY=
   ```

3. Start MongoDB if you want persistent data.

   If MongoDB is not running, the API still serves demo projects, mentors and certifications.

4. Run in development:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Useful scripts

- `npm run dev` - start the API with nodemon + ts-node
- `npm run build` - compile TypeScript to `dist/`
- `npm run typecheck` - run TypeScript checks only

## API Endpoints

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/projects` - PFE projects
- `/api/mentors` - Mentor management
- `/api/evaluations` - AI evaluations
- `/api/certifications` - Certifications
- `/api/health` - Health status
- `/api-docs` - Swagger documentation
