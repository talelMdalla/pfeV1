import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Journey } from "@/components/sections/Journey";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Mentora.ai — Plateforme intelligente d'encadrement PFE";
    const desc = "Plateforme IA d'encadrement de Projet de Fin d'Études : évaluation, parcours personnalisé, mentorat hybride, certification et insertion professionnelle.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Journey />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
