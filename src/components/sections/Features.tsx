import { motion } from "framer-motion";
import { Brain, Compass, Users, Briefcase, Award, BarChart3, MessagesSquare, Building2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Évaluation IA initiale",
    desc: "Tests adaptatifs propulsés par GPT-5 qui analysent compétences techniques, soft skills et appétences pour créer ton profil cognitif unique.",
    accent: "from-primary to-accent",
  },
  {
    icon: Compass,
    title: "Parcours personnalisé",
    desc: "Roadmap générée dynamiquement : projets évolutifs, ressources curées et étapes claires, alignées sur ton objectif PFE.",
    accent: "from-accent to-secondary",
  },
  {
    icon: Users,
    title: "Mentorat hybride",
    desc: "Combinaison d'un mentor humain expert et d'un copilote IA disponible 24/7 pour répondre à toutes tes questions techniques.",
    accent: "from-secondary to-primary",
  },
  {
    icon: BarChart3,
    title: "Suivi continu",
    desc: "Dashboard temps réel : progression, livrables, qualité du code, soft skills. Visibilité totale pour étudiant et encadrant.",
    accent: "from-primary to-secondary",
  },
  {
    icon: Briefcase,
    title: "Gestion PFE complète",
    desc: "Affectation intelligente des encadrants, jalons automatisés, soutenance virtuelle et grilles d'évaluation standardisées.",
    accent: "from-accent to-primary",
  },
  {
    icon: Award,
    title: "Certifications vérifiables",
    desc: "Compétences acquises certifiées sur blockchain et exportables sur LinkedIn. Un CV qui parle aux recruteurs.",
    accent: "from-secondary to-accent",
  },
  {
    icon: Building2,
    title: "Matching entreprises",
    desc: "Algorithme de mise en relation avec 320+ entreprises partenaires selon ton profil, tes projets et tes ambitions.",
    accent: "from-primary to-accent",
  },
  {
    icon: MessagesSquare,
    title: "Copilote conversationnel",
    desc: "Assistant IA contextualisé qui connaît ton projet, ton code et ton historique pour t'aider à débloquer chaque obstacle.",
    accent: "from-accent to-secondary",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-widest text-secondary mb-6">
            ⊹ Capacités intelligentes
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            Un écosystème <span className="text-gradient italic">complet</span>
            <br />pour réussir ton PFE.
          </h2>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            Huit modules intelligents intégrés qui couvrent tout le cycle académique et professionnel —
            de la première évaluation jusqu'à la signature du contrat.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative"
            >
              <div className="relative h-full glass rounded-3xl p-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />
                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${f.accent} grid place-items-center mb-5 shadow-lg`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="font-serif text-2xl mb-2 leading-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
