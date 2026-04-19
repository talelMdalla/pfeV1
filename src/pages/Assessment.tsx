import { Navbar } from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { apiService, StudentEvaluation, StudentEvaluationPayload } from "@/services/api";

const questions = [
  {
    cat: "Profil & motivations",
    q: "Quel type de probleme te fait vibrer le plus quand tu codes ?",
    options: [
      "Optimiser la performance et l'algorithmique",
      "Concevoir des interfaces fluides et belles",
      "Architecturer des systemes distribues",
      "Exploiter la donnee pour reveler des insights",
    ],
  },
  {
    cat: "Competences techniques",
    q: "Tu dois choisir une stack pour un projet ambitieux. Tu commences par :",
    options: [
      "React + Node + PostgreSQL - eprouve",
      "Next.js + Supabase - rapide a shipper",
      "Python + FastAPI + ML stack",
      "Je veux explorer du Rust / Go",
    ],
  },
  {
    cat: "Style de travail",
    q: "Face a un blocage de 3h, ton reflexe est de :",
    options: [
      "Documenter, prendre du recul et reformuler le probleme",
      "Demander a un pair de relire avec moi",
      "Plonger dans la doc et les sources jusqu'a comprendre",
      "Tester plein d'hypotheses en parallele",
    ],
  },
  {
    cat: "Soft skills",
    q: "Dans une equipe, tu te sens le plus utile quand tu :",
    options: [
      "Federes les idees et facilites la decision",
      "Delivres concretement les features critiques",
      "Challenges les choix techniques avec rigueur",
      "Anticipes les risques et la qualite",
    ],
  },
  {
    cat: "Vision PFE",
    q: "Ton PFE ideal ressemble a :",
    options: [
      "Un produit utilisateur abouti, deploye et utilise",
      "Une recherche pointue, publiable, a la frontiere",
      "Une plateforme technique scalable et robuste",
      "Une preuve de concept innovante en startup",
    ],
  },
] as const;

const Assessment = () => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [evaluation, setEvaluation] = useState<StudentEvaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const evaluateMutation = useMutation<StudentEvaluation, StudentEvaluationPayload>((payload) =>
    apiService.evaluateStudent(payload),
  );

  useEffect(() => {
    document.title = "Evaluation IA - Mentora.ai";
  }, []);

  const buildEvaluationPayload = (finalAnswers: number[]): StudentEvaluationPayload => {
    const selectedAnswers = finalAnswers.map((answer, index) => questions[index].options[answer]);

    return {
      studentId: user?.id ?? user?._id,
      answers: selectedAnswers,
      skills: selectedAnswers.slice(0, 3),
      interests: selectedAnswers.slice(1, 3),
      goals: selectedAnswers.slice(3),
      experience: selectedAnswers[4] ?? "Profil intermediaire",
    };
  };

  const submitEvaluation = async (finalAnswers: number[]) => {
    setIsSubmitting(true);

    try {
      const result = await evaluateMutation.mutate(buildEvaluationPayload(finalAnswers));
      setEvaluation(result);
    } catch (error) {
      toast({
        title: "Evaluation indisponible",
        description: "Le projet reste utilisable, mais l'analyse n'a pas pu etre terminee.",
        variant: "destructive",
      });
      console.error("Evaluation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const select = (answerIndex: number) => {
    const nextAnswers = [...answers, answerIndex];
    setAnswers(nextAnswers);

    if (step < questions.length - 1) {
      window.setTimeout(() => setStep((currentStep) => currentStep + 1), 180);
      return;
    }

    window.setTimeout(() => {
      void submitEvaluation(nextAnswers);
    }, 300);
  };

  const goToPreviousQuestion = () => {
    if (evaluation || isSubmitting || step === 0) {
      return;
    }

    setAnswers((current) => current.slice(0, -1));
    setStep((current) => Math.max(0, current - 1));
  };

  const progress = ((answers.length + (evaluation ? 1 : 0)) / questions.length) * 100;
  const safeStep = Math.min(Math.max(0, step), questions.length - 1);
  const current = questions[safeStep];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono uppercase tracking-widest text-secondary mb-4">
              <Brain className="w-3.5 h-3.5" /> Evaluation intelligente · 5 min
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl leading-tight">
              {evaluation ? (
                <>
                  Ton profil <span className="text-gradient italic">est pret</span>.
                </>
              ) : (
                <>
                  Apprenons a <span className="text-gradient italic">te connaitre</span>.
                </>
              )}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              {evaluation
                ? "La plateforme a prepare un profil, un axe de sujet PFE et des prochaines actions."
                : "Une evaluation de depart pour orienter le mentorat, la roadmap PFE et les recommandations d'entreprise."}
            </p>
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground mt-3">
                Mode demo actif : l'evaluation fonctionne meme sans compte et alimente le dashboard localement.
              </p>
            )}
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
              <span>QUESTION {Math.min(answers.length + 1, questions.length)} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45 }}
                className="h-full bg-gradient-primary rounded-full"
              />
            </div>
          </div>

          {!evaluation && !isSubmitting ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={safeStep}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="glass-strong rounded-3xl p-8 lg:p-12"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="text-xs font-mono text-secondary uppercase tracking-widest">{current.cat}</div>
                  {step > 0 ? (
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={goToPreviousQuestion}>
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Question précédente
                    </Button>
                  ) : null}
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">{current.q}</h2>
                <div className="space-y-3">
                  {current.options.map((option, optionIndex) => (
                    <motion.button
                      key={option}
                      whileHover={{ x: 4 }}
                      onClick={() => select(optionIndex)}
                      className="w-full text-left p-5 rounded-2xl glass hover:border-primary/60 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full glass grid place-items-center text-xs font-mono text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span className="text-foreground/90 group-hover:text-foreground">{option}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : isSubmitting ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 lg:p-12 text-center"
            >
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="font-serif text-3xl mb-2">Analyse en cours</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                L'IA structure votre profil, identifie vos forces et prepare un parcours PFE concret.
              </p>
            </motion.div>
          ) : evaluation ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-strong rounded-3xl p-8 lg:p-12 space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs font-mono text-secondary uppercase tracking-widest">Profil detecte</div>
                  <h3 className="font-serif text-3xl">{evaluation.profileLabel}</h3>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-2">Score global</div>
                  <div className="font-serif text-4xl">{evaluation.overallScore}/100</div>
                </div>
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-2">Experience estimee</div>
                  <div className="font-serif text-3xl capitalize">{evaluation.experience}</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <h4 className="font-serif text-xl mb-3">Synthese IA</h4>
                <p className="text-foreground/90 leading-relaxed">{evaluation.summary}</p>
                <p className="text-foreground/90 leading-relaxed mt-4">{evaluation.aiRecommendation}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                  <h4 className="font-medium mb-4">Forces detectees</h4>
                  <ul className="space-y-3">
                    {evaluation.strengths.map((strength) => (
                      <li key={strength} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                  <h4 className="font-medium mb-4">Prochaines etapes</h4>
                  <ul className="space-y-3">
                    {evaluation.nextSteps.map((stepItem) => (
                      <li key={stepItem} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span>{stepItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-muted/40 border border-border/50">
                <h4 className="font-serif text-xl mb-3">Themes PFE suggeres</h4>
                <div className="flex flex-wrap gap-3">
                  {evaluation.recommendedTopics.map((topic) => (
                    <span key={topic} className="px-3 py-2 rounded-full glass text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/dashboard">
                  Ouvrir mon dashboard personnalise <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Une erreur est survenue lors de l'evaluation.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assessment;
