import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] glass-strong p-12 lg:p-20 text-center"
        >
          <div className="absolute inset-0 bg-gradient-aurora opacity-10" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-primary rounded-full blur-3xl opacity-30" />

          <div className="relative max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Démarre en 2 minutes — gratuit</span>
            </div>
            <h2 className="font-serif text-5xl lg:text-7xl leading-[0.95] tracking-tight">
              Ton PFE mérite <br />
              <span className="text-gradient italic">le meilleur encadrement</span>.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Rejoins 12 000+ étudiants qui ont transformé leur projet de fin d'études en tremplin de carrière.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/assessment">
                  Lancer mon évaluation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/dashboard">Voir le dashboard</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
