import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-ai.jpg";

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden">
      {/* Background grid + radial glow */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-radial pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              <span className="text-foreground/80">Propulsé par GPT-5 & Gemini</span>
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight"
            >
              L'encadrement <span className="text-gradient italic">PFE</span>
              <br />
              réinventé par l'<span className="text-gradient-primary">intelligence</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              Une plateforme intelligente qui accompagne chaque étudiant — de l'évaluation initiale jusqu'à
              l'insertion professionnelle. Mentorat personnalisé, suivi continu, certification et matching
              entreprises, dans un seul écosystème.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/assessment">
                  Démarrer mon évaluation IA
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="glass" size="lg">
                <Play className="w-4 h-4" />
                Voir la démo (2 min)
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50 max-w-xl"
            >
              {[
                { value: "12K+", label: "Étudiants accompagnés" },
                { value: "94%", label: "Taux d'insertion" },
                { value: "320+", label: "Entreprises partenaires" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-3xl text-gradient-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass-strong shadow-elegant">
              <img
                src={heroImg}
                alt="Plateforme PFE intelligente avec IA"
                className="w-full h-full object-cover opacity-90"
                width={1600}
                height={1000}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 left-6 glass-strong rounded-2xl p-4 max-w-[200px]"
              >
                <div className="text-xs font-mono text-muted-foreground mb-2">PROFIL DÉTECTÉ</div>
                <div className="font-medium">Full-Stack JS</div>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-primary rounded-full" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">Niveau avancé · 78%</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-6 right-6 glass-strong rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary grid place-items-center shadow-glow">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Mentor IA</div>
                    <div className="text-sm font-medium">3 missions assignées</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating accent orbs */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 pt-8 border-t border-border/30"
        >
          <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
            Adopté par les grandes universités & écoles
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {["INSAT", "ENSI", "ESPRIT", "ENIT", "ISI", "POLYTECH"].map((logo) => (
              <span key={logo} className="font-serif text-2xl text-foreground/70">{logo}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
