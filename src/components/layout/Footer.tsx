import { Link } from "react-router-dom";
import { Brain, Github, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  const cols = [
    {
      title: "Plateforme",
      links: [
        { label: "Évaluation IA", href: "/assessment" },
        { label: "Dashboard étudiant", href: "/dashboard" },
        { label: "Espace mentor", href: "/mentor" },
        { label: "Entreprises", href: "/#partners" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Guides PFE", href: "#" },
        { label: "Blog", href: "#" },
        { label: "API", href: "#" },
      ],
    },
    {
      title: "Société",
      links: [
        { label: "À propos", href: "#" },
        { label: "Carrières", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Mentions légales", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border/50 mt-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl">Mentora<span className="text-gradient-primary">.ai</span></span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">PFE Intelligence</span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              L'écosystème intelligent qui accompagne l'étudiant de l'inscription à l'insertion professionnelle, propulsé par l'IA.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass grid place-items-center hover:border-primary/50 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-foreground/80 hover:text-primary transition-colors text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mentora.ai — Tous droits réservés.</p>
          <p className="font-mono text-xs">Conçu avec passion pour l'éducation de demain.</p>
        </div>
      </div>
    </footer>
  );
};
