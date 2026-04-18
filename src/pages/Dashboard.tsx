import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import {
  Activity, Award, BookOpen, Calendar, CheckCircle2, Code2, FileText,
  GitBranch, MessageSquare, Sparkles, Target, TrendingUp, Trophy, Users, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import student1 from "@/assets/student-1.jpg";
import mentor1 from "@/assets/mentor-1.jpg";
import { useEffect } from "react";

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
  useEffect(() => { document.title = "Dashboard — Mentora.ai"; }, []);

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
              <img src={student1} alt="Yasmine" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40" />
              <div>
                <p className="text-sm text-muted-foreground">Bonjour 👋</p>
                <h1 className="font-serif text-4xl">Yasmine, <span className="text-gradient italic">prête à avancer</span> ?</h1>
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
          {[
            { icon: Target, label: "Progression PFE", value: "62%", trend: "+8%", color: "from-primary to-accent" },
            { icon: Activity, label: "Streak", value: "14j", trend: "🔥", color: "from-accent to-secondary" },
            { icon: Trophy, label: "Certifications", value: "5/8", trend: "+2", color: "from-secondary to-primary" },
            { icon: TrendingUp, label: "Score global IA", value: "847", trend: "+47", color: "from-primary to-secondary" },
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
          ))}
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
                <h2 className="font-serif text-2xl">Roadmap PFE</h2>
                <p className="text-sm text-muted-foreground">Plateforme d'analyse vidéo en temps réel</p>
              </div>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-5">
                {milestones.map((m, i) => (
                  <div key={i} className="relative flex items-start gap-4 pl-1">
                    <div className={`relative z-10 w-6 h-6 rounded-full grid place-items-center shrink-0 ${
                      m.done ? "bg-gradient-primary shadow-glow" : m.current ? "bg-secondary animate-pulse-glow" : "bg-muted border border-border"
                    }`}>
                      {m.done && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-baseline">
                        <p className={`font-medium ${m.current ? "text-secondary" : m.done ? "" : "text-muted-foreground"}`}>{m.title}</p>
                        <span className="text-xs font-mono text-muted-foreground">{m.date}</span>
                      </div>
                      {m.current && (
                        <p className="text-xs text-muted-foreground mt-1">En cours · 3 sous-tâches restantes</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mentor card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-primary opacity-20 blur-3xl" />
            <h2 className="font-serif text-2xl mb-6">Ton mentor</h2>
            <div className="text-center">
              <img src={mentor1} alt="Pr. Sassi" className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-primary/20" />
              <h3 className="font-serif text-xl mt-4">Pr. Hatem Sassi</h3>
              <p className="text-xs text-muted-foreground">Computer Vision · 18 ans XP</p>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-secondary text-sm">★</span>
                ))}
              </div>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-muted/40 border border-border/50">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />PROCHAINE SESSION
              </div>
              <p className="text-sm font-medium">Mercredi 27 nov. · 14h00</p>
              <p className="text-xs text-muted-foreground mt-1">Code review prototype</p>
            </div>
            <Button variant="hero" size="sm" className="w-full mt-4">Rejoindre l'appel</Button>
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
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{s.name}</span>
                    <span className="font-mono text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
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
              {[
                { icon: Code2, text: "Refactorer le module d'inférence pour gagner 40% de perf" },
                { icon: BookOpen, text: "Lire : 'Real-time CV at scale' — papier MIT 2024" },
                { icon: Zap, text: "Tu es à 2 jours d'obtenir le badge TensorFlow Pro" },
                { icon: Users, text: "Connecte avec 3 alumni qui travaillent sur la CV" },
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors cursor-pointer group">
                  <s.icon className="w-4 h-4 text-secondary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-foreground/90">{s.text}</span>
                </li>
              ))}
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
