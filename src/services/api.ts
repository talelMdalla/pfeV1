import axios, { AxiosError, AxiosInstance } from "axios";

export type UserRole = "student" | "mentor" | "admin";
export type ProjectStatus = "proposed" | "in_progress" | "completed";

export interface UserProfile {
  name?: string;
  skills?: string[];
  level?: string;
  interests?: string[];
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  password?: string;
  role: UserRole;
  profile?: UserProfile;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProjectMilestone {
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  student: string | User;
  mentor?: string | User;
  status: ProjectStatus;
  progress: number;
  milestones?: ProjectMilestone[];
}

export interface Mentor {
  _id?: string;
  user?: User;
  expertise: string[];
  availability: boolean;
  students?: string[];
}

export interface MentorRecommendation {
  _id: string;
  mentorName: string;
  expertise: string[];
  matchScore: number;
  message: string;
  status: "suggested" | "pending" | "accepted";
  createdAt: string;
}

export interface Certification {
  _id?: string;
  user: string | User;
  title: string;
  skills: string[];
  issuedDate: string;
  issuer?: string;
}

export interface StudentEvaluationPayload {
  studentId?: string;
  answers?: string[];
  skills: string[];
  interests: string[];
  goals: string[];
  experience: string;
}

export interface StudentEvaluation {
  _id?: string;
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
  createdAt: string;
}

export interface MentorRecommendationQuery {
  interests?: string[];
  skills?: string[];
}

export interface PartnerCompany {
  _id: string;
  name: string;
  sector: string;
  description: string;
  location: string;
  openRoles: string[];
  requiredSkills: string[];
  websiteUrl: string;
  matchScore: number;
}

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

const STORAGE_KEYS = {
  token: "token",
  user: "user",
  evaluations: "mentora.evaluations",
} as const;

const toArray = <T>(value: unknown): T[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value as T[];
};

const normalizeUser = (user: User): User => ({
  ...user,
  id: user.id ?? user._id,
  _id: user._id ?? user.id,
});

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

class ApiService {
  private api: AxiosInstance;
  private readonly baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorPayload>) => {
        if (error.response?.status === 401) {
          this.clearSession();
        }

        return Promise.reject(error);
      },
    );
  }

  private clearSession() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    window.dispatchEvent(new Event("mentora:session-cleared"));
  }

  private getLocalEvaluations(): StudentEvaluation[] {
    return safeJsonParse<StudentEvaluation[]>(localStorage.getItem(STORAGE_KEYS.evaluations), []);
  }

  private persistEvaluation(evaluation: StudentEvaluation) {
    const current = this.getLocalEvaluations();
    const next = [evaluation, ...current.filter((item) => item._id !== evaluation._id)].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.evaluations, JSON.stringify(next));
  }

  private buildFallbackRecommendations(query: MentorRecommendationQuery): MentorRecommendation[] {
    const reference = [...(query.interests ?? []), ...(query.skills ?? [])]
      .join(", ")
      .trim();

    return [
      {
        _id: "local-rec-1",
        mentorName: "Pr. Hatem Sassi",
        expertise: ["Computer Vision", "Deep Learning", "MLOps"],
        matchScore: 92,
        status: "suggested",
        createdAt: new Date().toISOString(),
        message: reference
          ? `Ce mentor est recommande pour consolider votre parcours autour de ${reference}.`
          : "Ce mentor est recommande pour cadrer rapidement un PFE ambitieux et industrialisable.",
      },
    ];
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/login", { email, password });
    return {
      token: response.data.token,
      user: normalizeUser(response.data.user),
    };
  }

  async register(userData: Omit<User, "_id" | "id">): Promise<{ message: string; token?: string; user?: User }> {
    const response = await this.api.post<{ message: string; token?: string; user?: User }>("/auth/register", userData);
    return {
      ...response.data,
      user: response.data.user ? normalizeUser(response.data.user) : undefined,
    };
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>("/users");
    return response.data.map(normalizeUser);
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return normalizeUser(response.data);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.api.put<User>(`/users/${id}`, userData);
    return normalizeUser(response.data);
  }

  async getProjects(studentId?: string): Promise<Project[]> {
    const response = await this.api.get<Project[]>("/projects", {
      params: studentId ? { studentId } : undefined,
    });
    return response.data;
  }

  async createProject(projectData: Omit<Project, "_id">): Promise<Project> {
    const response = await this.api.post<Project>("/projects", projectData);
    return response.data;
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await this.api.get<Project>(`/projects/${id}`);
    return response.data;
  }

  async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const response = await this.api.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  }

  async evaluateStudent(payload: StudentEvaluationPayload): Promise<StudentEvaluation> {
    const response = await this.api.post<StudentEvaluation>("/evaluations/evaluate", payload);
    this.persistEvaluation(response.data);
    return response.data;
  }

  async getStudentEvaluations(studentId?: string): Promise<StudentEvaluation[]> {
    if (!studentId) {
      return this.getLocalEvaluations();
    }

    try {
      const response = await this.api.get<StudentEvaluation[]>(`/evaluations/student/${studentId}`);
      return response.data.length > 0 ? response.data : this.getLocalEvaluations();
    } catch {
      return this.getLocalEvaluations();
    }
  }

  async recommendPath(level: string, interests: string[]): Promise<{ path: string }> {
    const response = await this.api.post<{ path: string }>("/evaluations/recommend-path", { level, interests });
    return response.data;
  }

  async getMentors(): Promise<Mentor[]> {
    const response = await this.api.get<Mentor[]>("/mentors");
    return response.data;
  }

  async getMentorRecommendations(query: MentorRecommendationQuery = {}): Promise<MentorRecommendation[]> {
    try {
      const response = await this.api.get<MentorRecommendation[]>("/mentors/recommendations", {
        params: {
          interests: query.interests?.join(","),
          skills: query.skills?.join(","),
        },
      });
      return response.data;
    } catch {
      return this.buildFallbackRecommendations(query);
    }
  }

  async assignMentor(studentId: string, mentorId: string): Promise<{ message: string }> {
    const response = await this.api.post<{ message: string }>("/mentors/assign", { studentId, mentorId });
    return response.data;
  }

  async getCertifications(userId?: string): Promise<Certification[]> {
    const response = await this.api.get<Certification[]>("/certifications", {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  }

  async createCertification(certificationData: Omit<Certification, "_id">): Promise<Certification> {
    const response = await this.api.post<Certification>("/certifications", certificationData);
    return response.data;
  }

  async healthCheck(): Promise<{ status: string; message: string; database: string }> {
    const response = await this.api.get<{ status: string; message: string; database: string }>("/health");
    return response.data;
  }

  async getPartnerCompanies(skills?: string[]): Promise<PartnerCompany[]> {
    try {
      const response = await this.api.get<PartnerCompany[]>("/companies", {
        params: skills?.length ? { skills: skills.join(",") } : undefined,
      });
      return response.data;
    } catch {
      return [];
    }
  }
}

export const apiService = new ApiService();
export default apiService;
