import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import mentor1 from "@/assets/mentor-1.jpg";

const testimonials = [
  {
    quote: "L'évaluation IA m'a révélé des forces que je ne soupçonnais pas. Mon PFE en computer vision a débouché sur un CDI chez une scale-up parisienne.",
    name: "Yasmine Bouzid",
    role: "Ingénieure ML · Datadog",
    img: student1,
  },
  {
    quote: "Le suivi continu et le copilote IA m'ont fait gagner un temps fou. J'ai pu livrer un prototype 3× plus ambitieux que prévu.",
    name: "Karim Belhadj",
    role: "Full-Stack · Doctolib",
    img: student2,
  },
  {
    quote: "En tant qu'encadrant, j'ai enfin une vraie visibilité sur l'avancement. Mentora.ai a transformé ma façon de superviser.",
    name: "Pr. Hatem Sassi",
    role: "Encadrant · ENSI",
    img: mentor1,
  },
];

export const Testimonials = () => {
  return (
    <section className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-widest text-secondary mb-6">
            ✦ Ils l'ont vécu
          </div>
          <h2 className="font-serif text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            Des parcours <span className="text-gradient italic">transformés</span>.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-3xl p-8 flex flex-col gap-6 hover:border-primary/50 transition-all hover:-translate-y-1"
            >
              <Quote className="w-8 h-8 text-primary opacity-60" />
              <p className="font-serif text-xl leading-snug flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img src={t.img} alt={t.name} loading="lazy" width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
