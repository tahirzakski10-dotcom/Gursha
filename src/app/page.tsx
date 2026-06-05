"use client";

import { useState } from "react";
import GurshaHero from "@/components/GurshaHero";
import ScrollStory from "@/components/ScrollStory";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <GurshaHero />
      <ScrollStory />

      {/* Handoff Section */}
      <section id="get-started" className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-30" />
        
        <div className="max-w-3xl mx-auto z-10 glass p-10 md:p-16 rounded-[2rem]">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Get Started with Gursha
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            Join Gursha to scan meals, track nutrition, and get personalised guidance built around Ethiopian food.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-xl transition-all shadow-glow text-lg cursor-pointer"
            >
              Get Started
            </button>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-neutral-700 hover:bg-neutral-800 text-white font-medium rounded-xl transition-all text-lg cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
        
        {/* Background decorative blob */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-[200px] opacity-10 pointer-events-none" />
      </section>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </main>
  );
}
