import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  BookOpen,
  FileText,
  Loader2,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import mentor1 from "@/assets/mentor-1.jpg";
import student1 from "@/assets/student-1.jpg";
import { toast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import {
  apiService,
  Certification,
  MentorRecommendation,
  Project,
  StudentEvaluation,
} from "@/services/api";

const computeSkillLevel = (skill: string, index: number) => 65 + ((skill.length + index * 7) % 28);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const studentId = user?.id ?? user?._id;
  const studentQueryKey = studentId ?? "guest";

  useEffect(() => {
    document.title = "Dashboard - Mentora.ai";
  }, []);

  const {
    data: evaluationsData,
    loading: evaluationsLoading,
    error: evaluationsError,
  } = useApi<StudentEvaluation[]>(() => apiService.getStudentEvaluations(studentId), [studentQueryKey], { enabled: true });

  const latestEvaluation = evaluationsData?.[0] ?? null;
  const recommendationKey = useMemo(
    () => [...(latestEvaluation?.interests ?? []), ...(latestEvaluation?.skills ?? [])].join("|"),
    [latestEvaluation],
  );

  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useApi<Project[]>(() => apiService.getProjects(studentId), [studentQueryKey], { enabled: true });

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
  } = useApi<MentorRecommendation[]>(
    () =>
      apiService.getMentorRecommendations({
        interests: latestEvaluation?.interests,
        skills: latestEvaluation?.skills,
      }),
    [recommendationKey],
    { enabled: true },
  );

  const {
    data: certificationsData,
    loading: certificationsLoading,
  } = useApi<Certification[]>(() => apiService.getCertifications(studentId), [studentQueryKey], { enabled: true });

  useEffect(() => {
    if (evaluationsError) {
      toast({
        title: "Evaluations indisponibles",
        description: evaluationsError,
        variant: "destructive",
      });
    }
  }, [evaluationsError]);

  useEffect(() => {
    if (projectsError) {
      toast({
        title: "Projets indisponibles",
        description: projectsError,
        variant: "destructive",
      });
    }
  }, [projectsError]);

  useEffect(() => {
    if (recommendationsError) {
      toast({
        title: "Mentors indisponibles",
        description: recommendationsError,
        variant: "destructive",
      });
    }
  }, [recommendationsError]);

  const displayName = user?.profile?.name || (isAuthenticated ? "Etudiant" : "Visiteur demo");
  const evaluations = evaluationsData ?? [];
  const projects = projectsData ?? [];
  const recommendations = recommendationsData ?? [];
  const certifications = certificationsData ?? [];
  const activeProjects = projects.filter((project) => project.status === "in_progress");

  const exportProfile = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: user
        ? {
            email: user.email,
            role: user.role,
            profile: user.profile,
          }
        : null,
      evaluation: latestEvaluation,
      projects: projects.map((project) => ({
        title: project.title,
        status: project.status,
        progress: project.progress,
      })),
      certifications: certifications.map((certification) => ({
        title: certification.title,
        issuedDate: certification.issuedDate,
        skills: certification.skills,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mentora-profil-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Profil exporté",
      description: "Un fichier JSON téléchargeable pour votre portfolio ou votre dossier.",
    });
  };
  const completedProjects = projects.filter((project) => project.status === "completed");
  const skillItems = (latestEvaluation?.skills ?? []).slice(0, 5).map((skill, index) => ({
    name: skill,
    level: computeSkillLevel(skill, index),
  }));

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container pt-32 pb-20 space-y-8">
        {!isAuthenticated && (
          <div className="glass rounded-3xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <p className="font-medium">Mode demo actif</p>
              <p className="text-sm text-muted-foreground">
                Le dashboard fonctionne avec les donnees locales de l'evaluation et les jeux de donnees de secours du backend.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/assessment">Relancer l'evaluation</Link>
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img src={student1} alt={displayName} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40" />
              <div>
                <p className="text-sm text-muted-foreground">Bonjour</p>
                <h1 className="font-serif text-4xl">
                  {displayName}, <span className="text-gradient italic">pret a avancer</span> ?
                </h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {latestEvaluation?.summary ||
                "Commencez par l'evaluation IA pour obtenir une roadmap, des recommandations mentors et un suivi PFE personnalise."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="default" asChild>
              <Link to="/mentor">
                <MessageSquare className="w-4 h-4" />
                Espace mentor
              </Link>
            </Button>
            <Button variant="hero" size="default" asChild>
              <Link to="/assessment">
                <Sparkles className="w-4 h-4" />
                Mettre a jour mon profil
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Target,
              label: "Evaluations",
              value: evaluations.length.toString(),
              trend: latestEvaluation ? `${latestEvaluation.overallScore}/100` : "A lancer",
              color: "from-primary to-accent",
            },
            {
              icon: Activity,
              label: "Projets actifs",
              value: activeProjects.length.toString(),
              trend: projectsLoading ? "..." : `${projects.length} total`,
              color: "from-accent to-secondary",
            },
            {
              icon: Trophy,
              label: "Projets termines",
              value: completedProjects.length.toString(),
              trend: completedProjects.length > 0 ? "Livrables valides" : "En preparation",
              color: "from-secondary to-primary",
            },
            {
              icon: TrendingUp,
              label: "Certifications",
              value: certifications.length.toString(),
              trend: latestEvaluation ? latestEvaluation.profileLabel : "A construire",
              color: "from-primary to-secondary",
            },
          ].map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all"
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-10 blur-2xl group-hover:opacity-20 transition`} />
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} grid place-items-center`}>
                  <kpi.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs font-mono text-secondary">{kpi.trend}</span>
              </div>
              <div className="mt-4">
                <div className="font-serif text-4xl">{kpi.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl">Roadmap PFE</h2>
                <p className="text-sm text-muted-foreground">
                  {projectsLoading ? "Chargement..." : `${projects.length} projet${projects.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/assessment">Rafraichir mon profil</Link>
              </Button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project._id || project.title} className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === "completed"
                            ? "bg-success/20 text-success"
                            : project.status === "in_progress"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {project.status === "completed"
                          ? "Termine"
                          : project.status === "in_progress"
                            ? "En cours"
                            : "Propose"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="w-3 h-3" />
                        <span>{project.progress}% complete</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    {project.milestones && project.milestones.length > 0 && (
                      <div className="grid md:grid-cols-3 gap-3 mt-4">
                        {project.milestones.slice(0, 3).map((milestone) => (
                          <div key={milestone.title} className="p-3 rounded-2xl bg-background/40 border border-border/40">
                            <p className="text-sm font-medium">{milestone.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {milestone.completed ? "Valide" : "A finaliser"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucun projet n'est encore rattache a ce profil.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/assessment">Generer une roadmap PFE</Link>
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-primary opacity-20 blur-3xl" />
            <h2 className="font-serif text-2xl mb-6">Mentors recommandes</h2>

            {recommendationsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((recommendation) => (
                  <div key={recommendation._id} className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={mentor1} alt={recommendation.mentorName} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                      <div>
                        <h3 className="font-medium text-sm">{recommendation.mentorName}</h3>
                        <p className="text-xs text-muted-foreground">Match {recommendation.matchScore}%</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 mb-3">{recommendation.message}</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.expertise.slice(0, 3).map((expertise) => (
                        <span key={expertise} className="text-xs px-2 py-1 rounded-full glass">
                          {expertise}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune recommandation mentor disponible.</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl">Profil de competences</h2>
                <p className="text-sm text-muted-foreground">Construit a partir de votre derniere evaluation</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full glass text-secondary">
                {latestEvaluation ? latestEvaluation.profileLabel : "A completer"}
              </span>
            </div>

            {evaluationsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : skillItems.length > 0 ? (
              <div className="space-y-5">
                {skillItems.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{skill.name}</span>
                      <span className="font-mono text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="h-full bg-gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Passez d'abord l'evaluation IA pour generer votre profil.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/assessment">Faire une evaluation</Link>
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-3xl p-8 bg-gradient-to-br from-card via-card to-primary/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-xl">Suggestions IA</h2>
            </div>
            <ul className="space-y-3">
              {latestEvaluation ? (
                <>
                  <li className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors">
                    <Sparkles className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/90">{latestEvaluation.aiRecommendation}</span>
                  </li>
                  {latestEvaluation.recommendedTopics.slice(0, 3).map((topic) => (
                    <li key={topic} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors">
                      <BookOpen className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/90">Explorer un mini-projet ou un livrable autour de {topic}.</span>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { icon: Zap, text: "Lancez l'evaluation initiale pour obtenir un sujet PFE adapte." },
                    { icon: Users, text: "Recuperez des recommandations mentors basees sur vos centres d'interet." },
                    { icon: BookOpen, text: "Structurez une roadmap de livrables avant de commencer le stage." },
                  ].map((suggestion) => (
                    <li key={suggestion.text} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors">
                      <suggestion.icon className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/90">{suggestion.text}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl">Certifications acquises</h2>
              <p className="text-sm text-muted-foreground">Exportables dans le portfolio et le dossier de candidature.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" type="button" onClick={exportProfile}>
                <FileText className="w-4 h-4" />
                Exporter le profil
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/partners">Entreprises partenaires</Link>
              </Button>
            </div>
          </div>

          {certificationsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : certifications.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {certifications.map((certification) => (
                <div
                  key={certification._id || certification.title}
                  className="relative rounded-2xl p-5 bg-gradient-to-br from-primary to-secondary text-primary-foreground overflow-hidden"
                >
                  <Award className="w-8 h-8 mb-3" />
                  <h4 className="font-serif text-lg">{certification.title}</h4>
                  <p className="text-xs opacity-80 mt-1">
                    {new Date(certification.issuedDate).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-xs opacity-80 mt-3">{certification.skills.slice(0, 2).join(" · ")}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Les certifications apparaitront ici apres validation des parcours.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
