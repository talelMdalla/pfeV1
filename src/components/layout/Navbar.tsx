import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { label: "Plateforme", href: "/#features" },
  { label: "Parcours", href: "/#journey" },
  { label: "Tarifs", href: "/#pricing" },
  { label: "Évaluation IA", href: "/assessment" },
  { label: "Mentor", href: "/mentor" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container">
        <nav
          className={`flex items-center justify-between gap-6 px-5 py-3 rounded-full transition-all duration-500 ${
            scrolled ? "glass-strong shadow-card" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-tight">Mentora<span className="text-gradient-primary">.ai</span></span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">PFE Intelligence</span>
            </div>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className="px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors rounded-full hover:bg-muted/60"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Connexion</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/assessment">Commencer</Link>
            </Button>
          </div>

          <button
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full bg-muted/60"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {open && (
          <div className="lg:hidden mt-3 glass-strong rounded-3xl p-4 space-y-1 animate-in fade-in slide-in-from-top-2">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="block px-4 py-3 rounded-2xl text-foreground/80 hover:bg-muted/60 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/dashboard">Connexion</Link>
              </Button>
              <Button variant="hero" size="sm" className="flex-1" asChild>
                <Link to="/assessment">Commencer</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
