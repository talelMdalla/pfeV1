export const demoProjects = [
  {
    _id: "demo-project-1",
    title: "Plateforme d'analyse video temps reel",
    description:
      "Application web qui detecte les evenements critiques sur un flux video et produit un tableau de bord temps reel pour les encadrants.",
    student: "demo-student",
    mentor: "demo-mentor-1",
    status: "in_progress",
    progress: 62,
    milestones: [
      { title: "Cadrage du sujet", completed: true, dueDate: "2026-02-10T00:00:00.000Z" },
      { title: "Prototype IA", completed: true, dueDate: "2026-03-15T00:00:00.000Z" },
      { title: "Tests utilisateurs", completed: false, dueDate: "2026-05-03T00:00:00.000Z" },
    ],
  },
  {
    _id: "demo-project-2",
    title: "Assistant de mentoring PFE",
    description:
      "Copilote conversationnel pour aider les etudiants a structurer les livrables, suivre les jalons et preparer la soutenance.",
    student: "demo-student",
    mentor: "demo-mentor-2",
    status: "proposed",
    progress: 24,
    milestones: [
      { title: "Benchmark fonctionnel", completed: true, dueDate: "2026-01-20T00:00:00.000Z" },
      { title: "Parcours personnalise", completed: false, dueDate: "2026-04-28T00:00:00.000Z" },
    ],
  },
  {
    _id: "demo-project-3",
    title: "Matching etudiants-entreprises par IA",
    description:
      "Moteur de recommandation qui aligne competences, interets et besoins des entreprises partenaires.",
    student: "demo-student",
    mentor: "demo-mentor-3",
    status: "completed",
    progress: 100,
    milestones: [
      { title: "Collecte des besoins", completed: true, dueDate: "2025-12-15T00:00:00.000Z" },
      { title: "Modele de matching", completed: true, dueDate: "2026-02-20T00:00:00.000Z" },
      { title: "Demo partenaire", completed: true, dueDate: "2026-03-30T00:00:00.000Z" },
    ],
  },
] as const;

export const demoMentors = [
  {
    _id: "demo-mentor-1",
    user: {
      _id: "demo-mentor-user-1",
      email: "hatem.sassi@mentora.ai",
      role: "mentor",
      profile: {
        name: "Pr. Hatem Sassi",
        skills: ["Computer Vision", "Deep Learning", "MLOps"],
        level: "expert",
        interests: ["computer vision", "edge ai", "realtime systems"],
      },
    },
    expertise: ["Computer Vision", "Deep Learning", "MLOps"],
    availability: true,
    students: ["demo-student"],
  },
  {
    _id: "demo-mentor-2",
    user: {
      _id: "demo-mentor-user-2",
      email: "ines.khalfi@mentora.ai",
      role: "mentor",
      profile: {
        name: "Dr. Ines Khalfi",
        skills: ["Product Strategy", "SaaS", "UX Research"],
        level: "senior",
        interests: ["product", "saas", "user research"],
      },
    },
    expertise: ["Product Strategy", "SaaS", "UX Research"],
    availability: true,
    students: [],
  },
  {
    _id: "demo-mentor-3",
    user: {
      _id: "demo-mentor-user-3",
      email: "karim.bouali@mentora.ai",
      role: "mentor",
      profile: {
        name: "Karim Bouali",
        skills: ["Data Science", "Recommendation Systems", "Python"],
        level: "expert",
        interests: ["machine learning", "recommendation", "analytics"],
      },
    },
    expertise: ["Data Science", "Recommendation Systems", "Python"],
    availability: true,
    students: ["demo-student"],
  },
] as const;

export type PartnerCompany = {
  _id: string;
  name: string;
  sector: string;
  description: string;
  location: string;
  openRoles: string[];
  requiredSkills: string[];
  websiteUrl: string;
};

export const demoPartnerCompanies: PartnerCompany[] = [
  {
    _id: "partner-1",
    name: "NovaPay Labs",
    sector: "Fintech & paiements",
    description:
      "Équipe produit qui industrialise des APIs de paiement et de scoring risque ; accueille des PFE orientés qualité et sécurité.",
    location: "Tunis · Hybride",
    openRoles: ["PFE ingénieur backend", "Stage pré-embauche API"],
    requiredSkills: ["Node.js", "REST", "PostgreSQL", "Tests automatisés"],
    websiteUrl: "https://example.com/novapay",
  },
  {
    _id: "partner-2",
    name: "Atlas Vision AI",
    sector: "IA appliquée",
    description:
      "Startup spécialisée en vision par ordinateur pour l'industrie ; mentorat technique fort et pipeline MLOps mature.",
    location: "Sfax · Remote friendly",
    openRoles: ["PFE Computer Vision", "Junior ML engineer"],
    requiredSkills: ["Python", "PyTorch", "Deep Learning", "Docker"],
    websiteUrl: "https://example.com/atlas-vision",
  },
  {
    _id: "partner-3",
    name: "CivicStack",
    sector: "Civic tech / SaaS",
    description:
      "Plateforme SaaS pour les collectivités ; PFE souvent centrés sur UX, performance front et intégrations tierces.",
    location: "Paris · Tunis (bureau partenaire)",
    openRoles: ["PFE full-stack", "Design system & accessibilité"],
    requiredSkills: ["React", "TypeScript", "UX", "CI/CD"],
    websiteUrl: "https://example.com/civicstack",
  },
  {
    _id: "partner-4",
    name: "DataRiver Consulting",
    sector: "Data & recommandation",
    description:
      "Cabinet conseil data : missions longues avec livrables client ; idéal pour un PFE avec mise en production.",
    location: "Casablanca · Hybride",
    openRoles: ["PFE data engineering", "Recommandation & analytics"],
    requiredSkills: ["SQL", "Python", "Airflow", "Power BI"],
    websiteUrl: "https://example.com/datariver",
  },
];

export const demoCertifications = [
  {
    _id: "demo-cert-1",
    user: "demo-student",
    title: "React & TypeScript avance",
    skills: ["React", "TypeScript", "State management"],
    issuedDate: "2026-03-15T00:00:00.000Z",
    issuer: "Mentora.ai Academy",
  },
  {
    _id: "demo-cert-2",
    user: "demo-student",
    title: "Engineering d'API et integration IA",
    skills: ["Node.js", "REST API", "Prompt engineering"],
    issuedDate: "2026-02-08T00:00:00.000Z",
    issuer: "Mentora.ai Academy",
  },
] as const;
