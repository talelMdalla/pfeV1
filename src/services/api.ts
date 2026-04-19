import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types pour l'API
export interface User {
  _id?: string;
  email: string;
  password?: string;
  role: 'student' | 'mentor' | 'admin';
  profile?: {
    name?: string;
    skills?: string[];
    level?: string;
    interests?: string[];
  };
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  student: string;
  mentor?: string;
  status: 'proposed' | 'in_progress' | 'completed';
  progress: number;
  milestones?: Array<{
    title: string;
    completed: boolean;
    dueDate?: Date;
  }>;
}

export interface EvaluationRequest {
  answers: string[];
}

export interface PathRequest {
  level: string;
  interests: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token JWT automatiquement
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs globalement
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré, déconnexion automatique
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Méthodes d'authentification
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: Omit<User, '_id'>): Promise<{ message: string }> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Méthodes utilisateurs
  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  // Méthodes projets
  async getProjects(): Promise<Project[]> {
    const response = await this.api.get('/projects');
    return response.data;
  }

  async createProject(projectData: Omit<Project, '_id'>): Promise<Project> {
    const response = await this.api.post('/projects', projectData);
    return response.data;
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await this.api.get(`/projects/${id}`);
    return response.data;
  }

  async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const response = await this.api.put(`/projects/${id}`, projectData);
    return response.data;
  }

  // Méthodes évaluations IA
  async evaluateStudent(answers: string[]): Promise<{ evaluation: string }> {
    const response = await this.api.post('/evaluations/evaluate', { answers });
    return response.data;
  }

  async recommendPath(level: string, interests: string[]): Promise<{ path: string }> {
    const response = await this.api.post('/evaluations/recommend-path', { level, interests });
    return response.data;
  }

  // Méthodes mentors
  async getMentors(): Promise<any[]> {
    const response = await this.api.get('/mentors');
    return response.data;
  }

  async assignMentor(studentId: string, mentorId: string): Promise<{ message: string }> {
    const response = await this.api.post('/mentors/assign', { studentId, mentorId });
    return response.data;
  }

  // Méthodes certifications
  async getCertifications(): Promise<any[]> {
    const response = await this.api.get('/certifications');
    return response.data;
  }

  async createCertification(certificationData: any): Promise<any> {
    const response = await this.api.post('/certifications', certificationData);
    return response.data;
  }

  // Test de santé
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

// Instance singleton
export const apiService = new ApiService();
export default apiService;