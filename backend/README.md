# AI-PFE Backend

Backend API for the AI-powered PFE (Projets de Fin d'Études) supervision platform.

## Features

- User authentication and authorization
- Student evaluation using AI
- Personalized learning paths
- Project management
- Mentor assignment
- Certification system

## Technologies

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- OpenAI API for AI features
- JWT for authentication

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start MongoDB

4. Run in development:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/projects` - PFE projects
- `/api/mentors` - Mentor management
- `/api/evaluations` - AI evaluations
- `/api/certifications` - Certifications