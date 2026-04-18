import { motion } from "framer-motion";
import { Sparkles, Map, GraduationCap, Briefcase, Trophy } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Sparkles,
    title: "Inscription & évaluation IA",
    desc: "Test conversationnel adaptatif (45 min). L'IA cartographie tes compétences techniques, soft skills, motivations et style d'apprentissage.",
    tag: "≈ 45 min",
  },
  {
    n: "02",
    icon: Map,
    title: "Roadmap personnalisée",
    desc: "Génération d'un parcours sur mesure : mini-projets évolutifs, ressources, jalons hebdomadaires alignés avec un sujet PFE pertinent.",
    tag: "Adaptative",
  },
  {
    n: "03",
    icon: GraduationCap,
    title: "Encadrement hybride",
    desc: "Affectation d'un mentor expert et d'un copilote IA. Sessions vidéo, code reviews automatisées, suivi des livrables en temps réel.",
    tag: "Mentor + IA",
  },
  {
    n: "04",
    icon: Trophy,
    title: "Soutenance & certification",
    desc: "Soutenance assistée par IA, grilles standardisées, et délivrance de certifications vérifiables exportables sur LinkedIn.",
    tag: "Vérifiable",
  },
  {
    n: "05",
    icon: Briefcase,
    title: "Insertion professionnelle",
    desc: "Matching avec entreprises partenaires basé sur ton profil enrichi. Préparation aux entretiens et négociation salariale.",
    tag: "320+ entreprises",
  },
];

export const Journey = () => {
  return (
    <section id="journey" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-widest text-secondary mb-6">
            ◇ Le parcours
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            De l'inscription <br />à <span className="text-gradient italic">l'insertion</span>.
          </h2>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed max-w-2xl">
            Cinq étapes orchestrées par l'IA pour transformer un étudiant prometteur en professionnel reconnu.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

          <div className="space-y-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex flex-col lg:flex-row gap-6 lg:gap-12 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Node */}
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 -translate-y-0 z-10">
                  <div className="w-4 h-4 rounded-full bg-gradient-primary shadow-glow" />
                </div>

                <div className={`lg:w-1/2 pl-20 lg:pl-0 ${i % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}>
                  <div className="font-mono text-xs text-secondary mb-2">{s.tag}</div>
                  <h3 className="font-serif text-3xl lg:text-4xl mb-3 leading-tight">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>

                <div className={`lg:w-1/2 pl-20 lg:pl-0 ${i % 2 === 0 ? "lg:pl-12" : "lg:pr-12"}`}>
                  <div className="glass rounded-3xl p-8 relative overflow-hidden group hover:border-primary/40 transition-all">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-primary opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />
                    <div className="font-serif text-7xl text-gradient-primary opacity-30 leading-none">{s.n}</div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                        <s.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">Étape {s.n}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
