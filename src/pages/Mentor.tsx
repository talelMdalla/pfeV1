import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Activity, AlertCircle, Calendar, CheckCircle2, MessageSquare, MoreHorizontal,
  Search, Star, TrendingUp, Users
} from "lucide-react";
import { useEffect } from "react";
import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import mentor1 from "@/assets/mentor-1.jpg";

const students = [
  { name: "Yasmine Bouzid", project: "Plateforme analyse vidéo CV", progress: 62, status: "on-track", img: student1, lastActive: "il y a 2h" },
  { name: "Karim Belhadj", project: "App santé connectée", progress: 84, status: "on-track", img: student2, lastActive: "il y a 4h" },
  { name: "Lina Hadj", project: "Système recommandation ML", progress: 38, status: "at-risk", img: student1, lastActive: "il y a 2j" },
  { name: "Omar Trabelsi", project: "SaaS B2B IA", progress: 71, status: "on-track", img: student2, lastActive: "il y a 1h" },
  { name: "Sofia Maaroufi", project: "Plateforme e-learning", progress: 92, status: "ahead", img: student1, lastActive: "il y a 30 min" },
];

const Mentor = () => {
  useEffect(() => { document.title = "Espace Mentor — Mentora.ai"; }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container pt-32 pb-20 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={mentor1} alt="Mentor" className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40" />
            <div>
              <p className="text-sm text-muted-foreground">Espace encadrant</p>
              <h1 className="font-serif text-4xl">Pr. <span className="text-gradient italic">Hatem Sassi</span></h1>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Rechercher un étudiant..."
                className="h-11 pl-11 pr-4 rounded-full bg-muted/60 border border-border focus:border-primary/50 focus:outline-none w-64 text-sm"
              />
            </div>
            <Button variant="hero" size="default"><Calendar className="w-4 h-4" />Planifier</Button>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Étudiants encadrés", value: "12", sub: "PFE 2024-25" },
            { icon: TrendingUp, label: "Progression moyenne", value: "68%", sub: "+5% vs. cohorte" },
            { icon: AlertCircle, label: "À risque", value: "2", sub: "Action requise" },
            { icon: Star, label: "Note de satisfaction", value: "4.9", sub: "Sur 5" },
          ].map((k) => (
            <div key={k.label} className="glass rounded-3xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center">
                  <k.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="font-serif text-4xl">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
              <div className="text-xs text-secondary font-mono mt-2">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Students table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Mes étudiants</h2>
              <Button variant="ghost" size="sm">Filtres</Button>
            </div>
            <div className="space-y-3">
              {students.map((s) => (
                <div key={s.name} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/40 transition-colors group">
                  <img src={s.img} alt={s.name} className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{s.name}</p>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        s.status === "ahead" ? "bg-secondary/20 text-secondary" :
                        s.status === "at-risk" ? "bg-destructive/20 text-destructive" :
                        "bg-success/20 text-success"
                      }`}>
                        {s.status === "ahead" ? "En avance" : s.status === "at-risk" ? "À risque" : "Sur la voie"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.project} · {s.lastActive}</p>
                  </div>
                  <div className="hidden sm:block w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono text-muted-foreground">{s.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><MessageSquare className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI insights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-3xl p-8 bg-gradient-to-br from-card via-card to-primary/5">
            <h2 className="font-serif text-xl mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Insights IA
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30">
                <div className="text-xs font-mono text-destructive uppercase mb-1">⚠ Action requise</div>
                <p className="text-sm">Lina Hadj n'a livré aucun commit depuis 2 jours. Suggérer un point rapide ?</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30">
                <div className="text-xs font-mono text-secondary uppercase mb-1">✓ Bonne nouvelle</div>
                <p className="text-sm">Sofia est en avance de 12% sur sa roadmap. Profil candidat à valoriser auprès de partenaires.</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <div className="text-xs font-mono text-muted-foreground uppercase mb-1">📊 Tendance cohorte</div>
                <p className="text-sm">Cette promo progresse 8% plus vite que la précédente sur les jalons de prototypage.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Schedule */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl">Sessions à venir</h2>
            <Button variant="outline" size="sm">Voir le calendrier</Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { day: "Mer 27", time: "14:00", student: "Yasmine Bouzid", topic: "Code review prototype" },
              { day: "Jeu 28", time: "10:30", student: "Karim Belhadj", topic: "Préparation soutenance blanche" },
              { day: "Ven 29", time: "16:00", student: "Lina Hadj", topic: "Recadrage du sujet — urgent" },
            ].map((e, i) => (
              <div key={i} className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/40 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-mono text-xs text-secondary">{e.day} · {e.time}</div>
                    <div className="font-medium mt-1">{e.student}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">{e.topic}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Mentor;
