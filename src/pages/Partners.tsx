import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { apiService, PartnerCompany } from "@/services/api";
import { motion } from "framer-motion";
import { Building2, ExternalLink, Loader2, MapPin, Sparkles, Target } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Partners = () => {
  const { user } = useAuth();
  const studentId = user?.id ?? user?._id;
  const studentKey = studentId ?? "guest";

  useEffect(() => {
    document.title = "Entreprises partenaires — Mentora.ai";
  }, []);

  const { data: evaluationsData } = useApi(
    () => apiService.getStudentEvaluations(studentId),
    [studentKey],
    { enabled: true },
  );

  const skillsForMatching = useMemo(() => {
    const latest = evaluationsData?.[0];
    if (!latest) {
      return [] as string[];
    }
    return [...(latest.skills ?? []), ...(latest.interests ?? [])].slice(0, 16);
  }, [evaluationsData]);

  const matchKey = skillsForMatching.join("|");
  const [companies, setCompanies] = useState<PartnerCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const skills = skillsForMatching.length ? skillsForMatching : undefined;
    void apiService.getPartnerCompanies(skills).then((data) => {
      if (!cancelled) {
        setCompanies(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [matchKey]);

  const list = companies;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container pt-32 pb-20 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono uppercase tracking-widest text-secondary">
            <Building2 className="w-3.5 h-3.5" />
            Insertion professionnelle
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight">
            Entreprises <span className="text-gradient italic">partenaires</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Mise en relation avec des structures qui accueillent des stages et des PFE alignés sur vos compétences. Le tri par
            adéquation s&apos;appuie sur votre dernière évaluation lorsqu&apos;elle est disponible.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="hero" asChild>
              <Link to="/assessment">
                <Sparkles className="w-4 h-4" />
                Affiner mon profil
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Retour au dashboard</Link>
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">Aucune entreprise partenaire n&apos;est disponible pour le moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {list.map((company, index) => (
              <motion.article
                key={company._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-3xl p-8 flex flex-col gap-4 border border-border/60 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl">{company.name}</h2>
                    <p className="text-sm text-secondary font-mono mt-1">{company.sector}</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/15 text-primary shrink-0">
                    Match {company.matchScore}%
                  </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed flex-1">{company.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {company.location}
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Postes / PFE</p>
                  <ul className="space-y-1">
                    {company.openRoles.map((role) => (
                      <li key={role} className="flex items-center gap-2 text-sm">
                        <Target className="w-3.5 h-3.5 text-secondary shrink-0" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.requiredSkills.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-full glass">
                      {skill}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-fit mt-2" asChild>
                  <a href={company.websiteUrl} target="_blank" rel="noreferrer">
                    Site entreprise
                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                </Button>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Partners;
