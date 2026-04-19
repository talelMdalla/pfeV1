import { Navbar } from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@/hooks/useApi";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const questions = [
  {
    cat: "Profil & motivations",
    q: "Quel type de problème te fait vibrer le plus quand tu codes ?",
    options: [
      "Optimiser la performance et l'algorithmique",
      "Concevoir des interfaces fluides et belles",
      "Architecturer des systèmes distribués",
      "Exploiter la donnée pour révéler des insights",
    ],
  },
  {
    cat: "Compétences techniques",
    q: "Tu dois choisir une stack pour un projet ambitieux. Tu commences par :",
    options: [
      "React + Node + PostgreSQL — éprouvé",
      "Next.js + Supabase — rapide à shipper",
      "Python + FastAPI + ML stack",
      "Je veux explorer du Rust / Go",
    ],
  },
  {
    cat: "Style de travail",
    q: "Face à un blocage de 3h, ton réflexe est de :",
    options: [
      "Documenter, prendre du recul et reformuler le problème",
      "Demander à un pair de relire avec moi",
      "Plonger dans la doc et les sources jusqu'à comprendre",
      "Tester plein d'hypothèses en parallèle",
    ],
  },
  {
    cat: "Soft skills",
    q: "Dans une équipe, tu te sens le plus utile quand tu :",
    options: [
      "Fédères les idées et facilites la décision",
      "Délivres concrètement les features critiques",
      "Challenges les choix techniques avec rigueur",
      "Anticipes les risques et la qualité",
    ],
  },
  {
    cat: "Vision PFE",
    q: "Ton PFE idéal ressemble à :",
    options: [
      "Un produit utilisateur abouti, déployé et utilisé",
      "Une recherche pointue, publiable, à la frontière",
      "Une plateforme technique scalable et robuste",
      "Une preuve de concept innovante en startup",
    ],
  },
];

const Assessment = () => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const evaluateMutation = useMutation(apiService.evaluateStudent);

  useEffect(() => {
    document.title = "Évaluation IA — Mentora.ai";
  }, []);

  const select = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => submitEvaluation(next), 400);
    }
  };

  const submitEvaluation = async (finalAnswers: number[]) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer une évaluation.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convertir les réponses en données structurées pour l'API
      const evaluationData = {
        skills: finalAnswers.map((answer, index) => questions[index].options[answer]),
        interests: finalAnswers.slice(0, 2).map((answer, index) => questions[index].options[answer]),
        goals: finalAnswers.slice(2, 4).map((answer, index) => questions[index + 2].options[answer]),
        experience: finalAnswers[4] ? questions[4].options[finalAnswers[4]] : "Débutant",
      };

      const result = await evaluateMutation.mutate(evaluationData);
      setEvaluation(result);
      setDone(true);
    } catch (error) {
      toast({
        title: "Erreur lors de l'évaluation",
        description: "Une erreur est survenue lors de l'analyse de vos réponses.",
        variant: "destructive",
      });
      console.error("Evaluation error:", error);
    }
  };

  const progress = ((step + (done ? 1 : 0)) / questions.length) * 100;
  const current = questions[step];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono uppercase tracking-widest text-secondary mb-4">
              <Brain className="w-3.5 h-3.5" /> Évaluation cognitive · 5 min
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl leading-tight">
              {done ? <>Ton profil <span className="text-gradient italic">est prêt</span>.</> : <>Apprenons à <span className="text-gradient italic">te connaître</span>.</>}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              {done
                ? "L'IA a analysé tes réponses pour générer un parcours personnalisé."
                : "Une évaluation conversationnelle pour comprendre ton profil unique et créer ton parcours sur mesure."}
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
              <span>QUESTION {Math.min(step + 1, questions.length)} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-primary rounded-full"
              />
            </div>
          </div>

          {!done ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="glass-strong rounded-3xl p-8 lg:p-12"
              >
                <div className="text-xs font-mono text-secondary uppercase tracking-widest mb-3">{current.cat}</div>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">{current.q}</h2>
                <div className="space-y-3">
                  {current.options.map((opt, i) => (
                    <motion.button
                      key={opt}
                      whileHover={{ x: 4 }}
                      onClick={() => select(i)}
                      className="w-full text-left p-5 rounded-2xl glass hover:border-primary/60 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full glass grid place-items-center text-xs font-mono text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-foreground/90 group-hover:text-foreground">{opt}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 lg:p-12 space-y-8"
            >
              {evaluateMutation.loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <h3 className="font-serif text-2xl mb-2">Analyse en cours...</h3>
                  <p className="text-muted-foreground text-center">
                    L'IA analyse tes réponses pour créer ton profil personnalisé
                  </p>
                </div>
              ) : evaluation ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-secondary uppercase tracking-widest">Profil détecté</div>
                      <h3 className="font-serif text-3xl">Profil personnalisé</h3>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                    <h4 className="font-serif text-xl mb-3">🎯 Recommandation IA</h4>
                    <p className="text-foreground/90 leading-relaxed">
                      {evaluation.aiRecommendation || "Analyse en cours..."}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {evaluation.skills?.slice(0, 4).map((skill: string, index: number) => (
                      <div key={skill} className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Compétence {index + 1}</span>
                          <span className="font-mono text-sm text-secondary">Détectée</span>
                        </div>
                        <div className="text-sm text-foreground/90">{skill}</div>
                      </div>
                    ))}
                  </div>

                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/dashboard">
                      Découvrir mon dashboard personnalisé <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Une erreur est survenue lors de l'évaluation. Veuillez réessayer.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setStep(0);
                      setAnswers([]);
                      setDone(false);
                      setEvaluation(null);
                    }}
                  >
                    Recommencer l'évaluation
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assessment;
