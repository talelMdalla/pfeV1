import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import {
  Activity, Award, BookOpen, Calendar, CheckCircle2, Code2, FileText,
  GitBranch, MessageSquare, Sparkles, Target, TrendingUp, Trophy, Users, Zap, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import student1 from "@/assets/student-1.jpg";
import mentor1 from "@/assets/mentor-1.jpg";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const skills = [
  { name: "React / TypeScript", level: 88 },
  { name: "Node.js & APIs", level: 76 },
  { name: "Machine Learning", level: 62 },
  { name: "Soft skills · Communication", level: 81 },
  { name: "Architecture cloud", level: 54 },
];

const milestones = [
  { title: "Cadrage du sujet PFE", date: "12 oct.", done: true },
  { title: "Étude bibliographique", date: "28 oct.", done: true },
  { title: "Architecture & maquettes", date: "15 nov.", done: true },
  { title: "Prototype fonctionnel", date: "10 déc.", done: false, current: true },
  { title: "Tests utilisateurs", date: "20 janv.", done: false },
  { title: "Soutenance", date: "15 fév.", done: false },
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [projects, setProjects] = useState([]);

  const { data: evaluationsData, loading: evaluationsLoading, error: evaluationsError } = useApi(
    () => apiService.getStudentEvaluations(),
    [isAuthenticated]
  );

  const { data: projectsData, loading: projectsLoading, error: projectsError } = useApi(
    () => apiService.getProjects(),
    [isAuthenticated]
  );

  const { data: recommendationsData, loading: recommendationsLoading } = useApi(
    () => apiService.getMentorRecommendations(),
    [isAuthenticated]
  );

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    document.title = "Dashboard — Mentora.ai";

    if (evaluationsData) {
      setEvaluations(evaluationsData);
    }

    if (projectsData) {
      setProjects(projectsData);
    }

    if (recommendationsData) {
      setRecommendations(recommendationsData);
    }

    if (evaluationsError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les évaluations.",
        variant: "destructive",
      });
    }

    if (projectsError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets.",
        variant: "destructive",
      });
    }
  }, [evaluationsData, projectsData, recommendationsData, evaluationsError, projectsError]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl mb-4">Connexion requise</h1>
          <p className="text-muted-foreground">Veuillez vous connecter pour accéder à votre dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container pt-32 pb-20 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img src={student1} alt={user?.name || "Utilisateur"} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40" />
              <div>
                <p className="text-sm text-muted-foreground">Bonjour 👋</p>
                <h1 className="font-serif text-4xl">{user?.name || "Utilisateur"}, <span className="text-gradient italic">prêt à avancer</span> ?</h1>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="default"><MessageSquare className="w-4 h-4" />Mentor IA</Button>
            <Button variant="hero" size="default"><Sparkles className="w-4 h-4" />Reprendre le sprint</Button>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {evaluationsLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            [
              {
                icon: Target,
                label: "Évaluations",
                value: evaluations.length.toString(),
                trend: evaluations.length > 0 ? "✅" : "📝",
                color: "from-primary to-accent"
              },
              {
                icon: Activity,
                label: "Projets actifs",
                value: projects.filter((p: any) => p.status === 'in_progress').length.toString(),
                trend: projects.length > 0 ? "🚀" : "📋",
                color: "from-accent to-secondary"
              },
              {
                icon: Trophy,
                label: "Projets terminés",
                value: projects.filter((p: any) => p.status === 'completed').length.toString(),
                trend: projects.filter((p: any) => p.status === 'completed').length > 0 ? "🏆" : "⏳",
                color: "from-secondary to-primary"
              },
              {
                icon: TrendingUp,
                label: "Score IA",
                value: evaluations.length > 0 ? "847" : "N/A",
                trend: evaluations.length > 0 ? "+47" : "Évaluez-vous",
                color: "from-primary to-secondary"
              },
            ].map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all"
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${k.color} opacity-10 blur-2xl group-hover:opacity-20 transition`} />
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.color} grid place-items-center`}>
                    <k.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-mono text-success">{k.trend}</span>
                </div>
                <div className="mt-4">
                  <div className="font-serif text-4xl">{k.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl">Mes projets</h2>
                <p className="text-sm text-muted-foreground">
                  {projectsLoading ? "Chargement..." : `${projects.length} projet${projects.length > 1 ? 's' : ''}`}
                </p>
              </div>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 3).map((project: any, i: number) => (
                  <div key={project._id} className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{project.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'completed' ? 'bg-success/20 text-success' :
                        project.status === 'in_progress' ? 'bg-primary/20 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'in_progress' ? 'En cours' : 'Proposé'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="w-3 h-3" />
                        <span>{project.progress}% complété</span>
                      </div>
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucun projet trouvé</p>
                <Button variant="outline" size="sm">Créer un projet</Button>
              </div>
            )}
          </motion.div>

          {/* Mentor card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-primary opacity-20 blur-3xl" />
            <h2 className="font-serif text-2xl mb-6">Recommandations mentors</h2>

            {recommendationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.slice(0, 2).map((rec: any, i: number) => (
                  <div key={rec._id} className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={mentor1} alt="Mentor" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                      <div>
                        <h3 className="font-medium text-sm">Mentor #{i + 1}</h3>
                        <p className="text-xs text-muted-foreground">Recommandation IA</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 mb-3">{rec.message}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.status === 'accepted' ? 'bg-success/20 text-success' :
                        rec.status === 'pending' ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {rec.status === 'accepted' ? 'Accepté' :
                         rec.status === 'pending' ? 'En attente' : 'Rejeté'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rec.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune recommandation disponible</p>
                <Button variant="outline" size="sm">Demander une recommandation</Button>
              </div>
            )}

            <Button variant="hero" size="sm" className="w-full mt-4">Voir tous les mentors</Button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl">Profil de compétences</h2>
                <p className="text-sm text-muted-foreground">Analysé en continu par l'IA</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full glass text-secondary">Mis à jour il y a 2h</span>
            </div>
            <div className="space-y-5">
              {evaluations.length > 0 && evaluations[0].skills ? (
                evaluations[0].skills.slice(0, 5).map((skill: string, index: number) => {
                  const level = Math.floor(Math.random() * 40) + 60; // Simulation d'un niveau basé sur les compétences
                  return (
                    <div key={skill}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{skill}</span>
                        <span className="font-mono text-muted-foreground">{level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full bg-gradient-primary rounded-full"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Aucune compétence évaluée</p>
                  <Button variant="outline" size="sm">Faire une évaluation</Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Suggestions */}
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
              {evaluations.length > 0 && evaluations[0].aiRecommendation ? (
                <li className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors cursor-pointer group">
                  <Sparkles className="w-4 h-4 text-secondary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-foreground/90">{evaluations[0].aiRecommendation}</span>
                </li>
              ) : (
                <>
                  {[
                    { icon: Code2, text: "Complétez votre évaluation pour obtenir des recommandations personnalisées" },
                    { icon: BookOpen, text: "Découvrez les parcours PFE recommandés par l'IA" },
                    { icon: Zap, text: "Évaluez vos compétences pour un suivi personnalisé" },
                    { icon: Users, text: "Connectez-vous avec des mentors adaptés à votre profil" },
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors cursor-pointer group">
                      <s.icon className="w-4 h-4 text-secondary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-foreground/90">{s.text}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl">Certifications acquises</h2>
              <p className="text-sm text-muted-foreground">Vérifiables on-chain · exportables LinkedIn</p>
            </div>
            <Button variant="outline" size="sm"><FileText className="w-4 h-4" />Exporter CV</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "React Avancé", date: "Sept. 2024", color: "from-primary to-accent" },
              { name: "TypeScript Pro", date: "Oct. 2024", color: "from-accent to-secondary" },
              { name: "API Design", date: "Oct. 2024", color: "from-secondary to-primary" },
              { name: "Git Workflow", date: "Nov. 2024", color: "from-primary to-secondary" },
            ].map((c, i) => (
              <div key={i} className={`relative rounded-2xl p-5 bg-gradient-to-br ${c.color} text-primary-foreground overflow-hidden`}>
                <Award className="w-8 h-8 mb-3" />
                <h4 className="font-serif text-lg">{c.name}</h4>
                <p className="text-xs opacity-80 mt-1">{c.date}</p>
                <GitBranch className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10" />
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
